from fastapi import APIRouter
from app.models.practice import Topic

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("")
async def get_topics():
    topics = await Topic.find_all().to_list()
    return [{"id": str(t.id), "name": t.name, "slug": t.slug, "description": t.description, "domain": t.domain} for t in topics]

@router.get("/{topic_id}")
async def get_topic(topic_id: str):
    topic = await Topic.get(topic_id)
    if not topic:
        return {"error": "Topic not found"}
    return {"id": str(topic.id), "name": topic.name, "slug": topic.slug, "description": topic.description}
