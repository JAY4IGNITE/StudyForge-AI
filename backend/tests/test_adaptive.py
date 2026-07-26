import pytest
from app.services.adaptive_service import AdaptiveLearningService
from app.models.practice import MasteryProfile

@pytest.mark.asyncio
async def test_adaptive_difficulty_calculation(monkeypatch):
    class DummyMastery:
        def __init__(self):
            self.mastery_score = 50.0
            self.rolling_accuracy = 0.5
            self.confidence = 0.5
            self.recommended_difficulty = "medium"
        async def save(self):
            pass

    dummy = DummyMastery()

    async def mock_get_or_create(*args):
        return dummy

    monkeypatch.setattr(AdaptiveLearningService, "get_or_create_mastery", mock_get_or_create)

    # Test score improvement -> should increase difficulty recommendation
    res = await AdaptiveLearningService.update_mastery_after_attempt("user1", "topic1", 95.0)
    assert res.mastery_score > 50.0
    assert res.recommended_difficulty in ["medium", "hard"]
