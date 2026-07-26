from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.models.practice import MasteryProfile, Topic
from app.models.feedback import UserRoadmap, RoadmapItem

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.get("")
async def get_user_roadmap(user: User = Depends(get_current_user)):
    existing = await UserRoadmap.find_one(UserRoadmap.user_id == str(user.id))
    if existing:
        return existing

    # Generate personalized roadmap based on target role & current mastery
    masteries = await MasteryProfile.find(MasteryProfile.user_id == str(user.id)).to_list()
    topics = await Topic.find_all().to_list()
    topic_map = {str(t.id): t.name for t in topics}

    steps = []
    step_num = 1

    # Prioritize weak topics first
    weak_masteries = [m for m in masteries if m.mastery_score < 65.0]
    for wm in weak_masteries:
        steps.append(RoadmapItem(
            step_number=step_num,
            topic_name=topic_map.get(wm.topic_id, "Core Subject"),
            reason="Low accuracy mastery detected; reinforcement recommended",
            estimated_hours=4
        ))
        step_num += 1

    # Add general learning topics
    for t in topics:
        if not any(s.topic_name == t.name for s in steps):
            steps.append(RoadmapItem(
                step_number=step_num,
                topic_name=t.name,
                reason=f"Recommended for {user.target_role or 'software engineer'} preparation",
                estimated_hours=6
            ))
            step_num += 1

    roadmap = UserRoadmap(
        user_id=str(user.id),
        target_role=user.target_role or "Software Engineer",
        steps=steps[:5]
    )
    await roadmap.insert()
    return roadmap
