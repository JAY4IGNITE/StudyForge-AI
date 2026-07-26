from fastapi import APIRouter
from app.api.routes import auth, users, topics, practice, interview, resources, analytics

api_router = APIRouter(prefix="/v1")

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(topics.router)
api_router.include_router(practice.router)
api_router.include_router(interview.router)
api_router.include_router(resources.router)
api_router.include_router(analytics.router)
