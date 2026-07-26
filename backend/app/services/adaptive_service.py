from typing import Optional
from app.models.practice import MasteryProfile
from app.core.logging import logger

class AdaptiveLearningService:
    @staticmethod
    async def get_or_create_mastery(user_id: str, topic_id: str) -> MasteryProfile:
        mastery = await MasteryProfile.find_one(
            MasteryProfile.user_id == user_id,
            MasteryProfile.topic_id == topic_id
        )
        if not mastery:
            mastery = MasteryProfile(
                user_id=user_id,
                topic_id=topic_id,
                mastery_score=50.0,
                confidence=0.5,
                rolling_accuracy=0.5,
                recommended_difficulty="medium"
            )
            await mastery.insert()
        return mastery

    @staticmethod
    async def update_mastery_after_attempt(user_id: str, topic_id: str, latest_score: float) -> MasteryProfile:
        mastery = await AdaptiveLearningService.get_or_create_mastery(user_id, topic_id)
        
        # Exponential rolling update
        alpha = 0.3
        normalized_latest = latest_score / 100.0
        new_rolling_acc = (1 - alpha) * mastery.rolling_accuracy + alpha * normalized_latest
        new_mastery_score = (1 - alpha) * mastery.mastery_score + alpha * latest_score
        
        # Determine recommended difficulty
        if new_mastery_score >= 80.0:
            rec_diff = "hard"
        elif new_mastery_score <= 45.0:
            rec_diff = "easy"
        else:
            rec_diff = "medium"
            
        mastery.rolling_accuracy = round(new_rolling_acc, 2)
        mastery.mastery_score = round(new_mastery_score, 1)
        mastery.confidence = min(1.0, mastery.confidence + 0.05)
        mastery.recommended_difficulty = rec_diff
        await mastery.save()
        
        logger.info(f"Updated mastery for user {user_id} on topic {topic_id}: score={mastery.mastery_score}, diff={rec_diff}")
        return mastery

adaptive_service = AdaptiveLearningService()
