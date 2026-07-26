from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User
from app.models.practice import Attempt, PracticeSession, MasteryProfile, Topic

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
async def get_analytics_overview(user: User = Depends(get_current_user)):
    attempts = await Attempt.find(Attempt.user_id == str(user.id)).to_list()
    sessions = await PracticeSession.find(PracticeSession.user_id == str(user.id)).to_list()
    
    total_attempts = len(attempts)
    avg_score = round(sum(a.score for a in attempts) / total_attempts, 1) if total_attempts > 0 else 0.0
    completed_sessions = len([s for s in sessions if s.status == "completed"])
    
    # Recent attempt history chart data
    history = [
        {
            "date": a.submitted_at.strftime("%b %d %H:%M"),
            "score": a.score,
            "semantic_score": a.semantic_score
        }
        for a in attempts[-10:]
    ]

    return {
        "total_practice_sessions": len(sessions),
        "completed_sessions": completed_sessions,
        "total_questions_answered": total_attempts,
        "average_score": avg_score,
        "recent_performance": history
    }

@router.get("/topics")
async def get_topic_analytics(user: User = Depends(get_current_user)):
    masteries = await MasteryProfile.find(MasteryProfile.user_id == str(user.id)).to_list()
    topics = await Topic.find_all().to_list()
    topic_map = {str(t.id): t.name for t in topics}

    result = []
    for m in masteries:
        result.append({
            "topic_id": m.topic_id,
            "topic_name": topic_map.get(m.topic_id, "Unknown Topic"),
            "mastery_score": m.mastery_score,
            "rolling_accuracy": round(m.rolling_accuracy * 100, 1),
            "recommended_difficulty": m.recommended_difficulty
        })

    # Find weak topics (mastery < 60)
    weak_topics = [item for item in result if item["mastery_score"] < 60.0]

    return {
        "mastery_breakdown": result,
        "weak_topics": weak_topics
    }
