from fastapi import APIRouter, Depends
from typing import Optional
from app.models.practice import LearningResource

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("")
async def get_resources(topic_id: Optional[str] = None):
    if topic_id:
        resources = await LearningResource.find(LearningResource.topic_id == topic_id).to_list()
    else:
        resources = await LearningResource.find_all().to_list()
    return [{"id": str(r.id), "title": r.title, "url": r.url, "description": r.description, "difficulty": r.difficulty, "tags": r.tags} for r in resources]

@router.post("/search")
async def search_resources(query: str):
    # Search title or tags
    resources = await LearningResource.find_all().to_list()
    filtered = [r for r in resources if query.lower() in r.title.lower() or any(query.lower() in t.lower() for t in r.tags)]
    return [{"id": str(r.id), "title": r.title, "url": r.url, "description": r.description} for r in filtered]
