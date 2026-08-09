import pytest
from app.services.practice_service import practice_service
from app.core.errors import StudyForgeException, ErrorCode
from app.models.practice import Topic, PracticeSession
from app.services.adaptive_service import adaptive_service

@pytest.mark.asyncio
async def test_create_session_success(monkeypatch):
    class DummyTopic:
        id = "topic123"
        
    class DummyMastery:
        recommended_difficulty = "medium"

    class DummySession:
        def __init__(self, **kwargs):
            self.id = "session123"
            self.target_difficulty = kwargs.get("target_difficulty")
        async def insert(self):
            pass

    async def mock_topic_get(topic_id):
        return DummyTopic()
        
    async def mock_get_mastery(user_id, topic_id):
        return DummyMastery()

    monkeypatch.setattr(Topic, "get", mock_topic_get)
    monkeypatch.setattr(adaptive_service, "get_or_create_mastery", mock_get_mastery)
    monkeypatch.setattr("app.services.practice_service.PracticeSession", DummySession)

    result = await practice_service.create_session("user1", "topic123", "software engineer")
    assert result["session_id"] == "session123"
    assert result["target_difficulty"] == "medium"

@pytest.mark.asyncio
async def test_create_session_topic_not_found(monkeypatch):
    async def mock_topic_get(topic_id):
        return None

    monkeypatch.setattr(Topic, "get", mock_topic_get)

    with pytest.raises(StudyForgeException) as exc:
        await practice_service.create_session("user1", "invalid", "swe")
        
    assert exc.value.code == ErrorCode.TOPIC_NOT_FOUND
    
@pytest.mark.asyncio
async def test_get_session_success(monkeypatch):
    class DummySession:
        id = "session123"
        user_id = "user1"

    async def mock_session_get(session_id):
        return DummySession()

    monkeypatch.setattr(PracticeSession, "get", mock_session_get)

    session = await practice_service.get_session("session123", "user1")
    assert session.id == "session123"

@pytest.mark.asyncio
async def test_get_session_not_found(monkeypatch):
    async def mock_session_get(session_id):
        return None

    monkeypatch.setattr(PracticeSession, "get", mock_session_get)

    with pytest.raises(StudyForgeException) as exc:
        await practice_service.get_session("invalid", "user1")
        
    assert exc.value.code == ErrorCode.SESSION_NOT_FOUND
