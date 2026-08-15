from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.ats_report import AtsReport
from app.schemas.ats import AtsAnalyzeRequest, AtsAnalysisResponse, JobDescriptionSchema, AtsReportSchema
from app.services.job_parser import job_parser_service
from app.services.ats_engine import ats_engine_service
from app.schemas.resume import ParsedResume

router = APIRouter()

@router.post("/analyze", response_model=AtsAnalysisResponse)
async def analyze_resume(
    request: AtsAnalyzeRequest,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Analyze a resume against a job description."""
    resume = await Resume.get(request.resume_id)
    if not resume or str(resume.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Resume not found")
        
    if not resume.parsed_data:
        raise HTTPException(status_code=400, detail="Resume has not been parsed yet")
        
    parsed_resume = ParsedResume(**resume.parsed_data)
    
    # Parse job description
    jd: JobDescriptionSchema = await job_parser_service.parse_job_description(request.job_text)
    
    # Analyze
    analysis: AtsAnalysisResponse = await ats_engine_service.analyze(parsed_resume, jd)
    
    # Save Report
    report = AtsReport(
        user_id=str(current_user.id),
        resume_id=str(resume.id),
        job_description_text=request.job_text,
        overall_score=analysis.overall_score,
        keyword_score=analysis.breakdown.keyword_score,
        semantic_score=analysis.breakdown.semantic_score,
        formatting_score=analysis.breakdown.formatting_score,
        completeness_score=analysis.breakdown.completeness_score,
        impact_score=analysis.breakdown.impact_score,
        confidence=analysis.confidence,
        matched_keywords=analysis.matched_keywords,
        missing_keywords=analysis.missing_keywords,
        warnings=analysis.warnings,
        recommendations=analysis.recommendations
    )
    await report.insert()
    
    return analysis

@router.get("/history", response_model=List[AtsReportSchema])
async def get_ats_history(
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get ATS report history for the user."""
    reports = await AtsReport.find(AtsReport.user_id == str(current_user.id)).sort("-created_at").to_list()
    return reports

@router.get("/{id}", response_model=AtsReportSchema)
async def get_ats_report(
    id: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get a specific ATS report."""
    report = await AtsReport.get(id)
    if not report or str(report.user_id) != str(current_user.id):
        raise HTTPException(status_code=404, detail="Report not found")
    return report
