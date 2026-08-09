from fastapi import APIRouter
from app.api.routes import auth, users, topics, practice, interview, resources, analytics, feedback, roadmap, adaptive, ai, leetcode, resumes, ats

api_router = APIRouter(prefix="/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(topics.router)
api_router.include_router(practice.router)
api_router.include_router(interview.router)
api_router.include_router(resources.router)
api_router.include_router(analytics.router)
api_router.include_router(feedback.router)
api_router.include_router(roadmap.router)
api_router.include_router(adaptive.router)
api_router.include_router(leetcode.router)
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(resumes.router, prefix="/resumes", tags=["Resumes"])
api_router.include_router(ats.router, prefix="/ats", tags=["ATS"])

