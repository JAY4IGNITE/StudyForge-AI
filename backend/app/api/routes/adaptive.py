from fastapi import APIRouter
from app.models.practice import MasteryProfile

router = APIRouter(prefix="/adaptive", tags=["Adaptive Learning"])


@router.get("/policy-summary")
async def get_adaptive_policy_summary():
    return {
        "policy_name": "Explainable Exponential Rolling Accuracy Policy",
        "description": "Calculates topic mastery using rolling accuracy combined with response length, difficulty multipliers, and prompt decay.",
        "formula": "Mastery_new = (1 - alpha) * Mastery_old + alpha * Latest_Score",
        "alpha_learning_rate": 0.3,
        "difficulty_thresholds": {
            "hard": "Mastery >= 80.0%",
            "medium": "45.0% < Mastery < 80.0%",
            "easy": "Mastery <= 45.0%",
        },
    }
