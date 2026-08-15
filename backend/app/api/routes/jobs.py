from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional, Any
from app.api.deps import get_current_user
from app.models.user import User
from app.models.job import JobApplication
from app.schemas.job import (
    JobSearchRequest,
    JobSearchResponse,
    JobApplicationCreate,
    JobApplicationResponse,
    JobApplicationUpdate,
)
from app.services.jobs.jsearch_service import jsearch_service
from app.services.jobs.job_recommendation import job_recommendation_service
from app.services.jobs.job_matcher import job_matcher

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/search")
async def search_jobs(
    query: str = Query(..., min_length=2),
    page: int = Query(1, ge=1),
    num_pages: int = Query(1, ge=1, le=10),
    employment_types: Optional[str] = None,
    remote_jobs_only: bool = False,
    date_posted: str = "all",
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Search for jobs using the JSearch external provider.
    """
    try:
        results = await jsearch_service.search_jobs(
            query=query,
            page=page,
            num_pages=num_pages,
            employment_types=employment_types,
            remote_jobs_only=remote_jobs_only,
            date_posted=date_posted,
        )
        return results
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/saved", response_model=List[JobApplicationResponse])
async def get_saved_jobs(current_user: User = Depends(get_current_user)):
    """
    Get all saved jobs and applications for the current user.
    """
    applications = await JobApplication.find(
        JobApplication.user_id == str(current_user.id)
    ).to_list()

    # Map to schema response
    return [
        JobApplicationResponse(
            id=str(app.id),
            user_id=app.user_id,
            job_id=app.job_id,
            company_name=app.company_name,
            job_title=app.job_title,
            location=app.location,
            application_url=app.application_url,
            status=app.status,
            notes=app.notes,
            saved_at=app.saved_at,
            applied_at=app.applied_at,
            created_at=app.created_at,
            updated_at=app.updated_at,
        )
        for app in applications
    ]


@router.post("/{job_id}/save", response_model=JobApplicationResponse)
async def save_job(
    job_id: str,
    job_data: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
):
    """
    Save a job or track an application.
    """
    if job_data.job_id != job_id:
        raise HTTPException(status_code=400, detail="Job ID mismatch")

    existing = await JobApplication.find_one(
        JobApplication.user_id == str(current_user.id), JobApplication.job_id == job_id
    )

    if existing:
        return JobApplicationResponse(**existing.dict(), id=str(existing.id))

    application = JobApplication(
        user_id=str(current_user.id),
        job_id=job_id,
        company_name=job_data.company_name,
        job_title=job_data.job_title,
        location=job_data.location,
        application_url=job_data.application_url,
        status="Saved",
    )

    await application.insert()
    return JobApplicationResponse(**application.dict(), id=str(application.id))


@router.delete("/{job_id}/save", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_job(job_id: str, current_user: User = Depends(get_current_user)):
    """
    Remove a saved job.
    """
    existing = await JobApplication.find_one(
        JobApplication.user_id == str(current_user.id), JobApplication.job_id == job_id
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Saved job not found")

    await existing.delete()
    return None


@router.patch("/applications/{app_id}", response_model=JobApplicationResponse)
async def update_application(
    app_id: str,
    update_data: JobApplicationUpdate,
    current_user: User = Depends(get_current_user),
):
    """
    Update the status or notes of an application.
    """
    from bson import ObjectId

    try:
        obj_id = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid application ID")

    application = await JobApplication.get(obj_id)
    if not application or application.user_id != str(current_user.id):
        raise HTTPException(status_code=404, detail="Application not found")

    if update_data.status:
        application.status = update_data.status
        from datetime import datetime, timezone

        if update_data.status == "Applied" and not application.applied_at:
            application.applied_at = datetime.now(timezone.utc)

    if update_data.notes is not None:
        application.notes = update_data.notes

    await application.save()
    return JobApplicationResponse(**application.dict(), id=str(application.id))


@router.get("/{job_id}")
async def get_job_details(job_id: str, current_user: User = Depends(get_current_user)):
    """
    Get job details from JSearch.
    """
    details = await jsearch_service.get_job_details(job_id)
    if details and "data" in details and len(details["data"]) > 0:
        job = details["data"][0]
        match = job_matcher.calculate_match(
            job_requirements=job.get("job_required_skills", []),
            user_skills=current_user.preferences.preferred_subjects,
            user_preferences=current_user.preferences.dict(),
        )
        return {"job": details, "match": match}
    return {"job": details, "match": None}


@router.post("/{job_id}/analyze")
async def analyze_job(job_id: str, current_user: User = Depends(get_current_user)):
    """
    Analyze a job using AI to provide insights.
    """
    return await job_recommendation_service.analyze_job(job_id, current_user)


@router.post("/{job_id}/roadmap")
async def generate_job_roadmap(
    job_id: str, current_user: User = Depends(get_current_user)
):
    """
    Generate a study roadmap based on skill gaps for a job.
    """
    # Simply analyze first to get missing skills, then we'd normally call the Roadmap service.
    # We will reuse the analysis for this mock roadmap generator.
    analysis = await job_recommendation_service.analyze_job(job_id, current_user)

    # In a full implementation, we would insert a new Roadmap document into the DB here
    # For now, return a mock roadmap structure based on the missing skills

    return {
        "title": f"Interview Prep Roadmap",
        "description": "Personalized 7-day plan based on your skill gaps for this role.",
        "days": [
            {
                "day": 1,
                "focus": "Core Fundamentals",
                "tasks": analysis["analysis"].get("preparation_recommendations", [])[
                    :2
                ],
            },
            {
                "day": 2,
                "focus": "Advanced Concepts",
                "tasks": ["Practice coding problems related to key technologies"],
            },
            {
                "day": 3,
                "focus": "Mock Interview",
                "tasks": ["Run a StudyForge AI Mock Interview for this role"],
            },
        ],
    }
