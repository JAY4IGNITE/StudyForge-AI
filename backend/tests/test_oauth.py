import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User
from app.services.auth_service import auth_service
from app.schemas.auth import TokenResponse

client = TestClient(app)

class MockUser:
    id = "mock-id-12345"
    email = "mock.google.user@example.com"
    display_name = "Mock Google User"
    auth_provider = "google"
    oauth_id = "mock-google-id-12345"
    role = "learner"

@pytest.mark.asyncio
async def test_oauth_google_login_auto_auth(monkeypatch):
    # Mock settings
    from app.core.config import settings
    monkeypatch.setattr(settings, "GOOGLE_CLIENT_ID", "your_google_client_id")

    # Mock Beanie getters to avoid CollectionWasNotInitialized
    # monkeypatch.setattr(User, "get_pymongo_collection", lambda *args: None)

    # Mock User find_one and insert
    async def mock_find_one(*args, **kwargs):
        return None

    async def mock_insert(self, *args, **kwargs):
        return self

    monkeypatch.setattr(User, "find_one", mock_find_one)
    monkeypatch.setattr(User, "insert", mock_insert)

    # Mock auth_service.create_user_tokens
    async def mock_create_user_tokens(*args, **kwargs):
        return TokenResponse(access_token="mock_access_token", token_type="bearer"), "mock_refresh_token"

    monkeypatch.setattr(auth_service, "create_user_tokens", mock_create_user_tokens)

    # Execute login
    response = client.get("/api/v1/oauth/google/login", follow_redirects=False)
    assert response.status_code == 307
    assert "access_token=mock_access_token" in response.headers["location"]

    assert "/oauth/callback" in response.headers["location"]


@pytest.mark.asyncio
async def test_oauth_github_login_auto_auth(monkeypatch):
    # Mock settings
    from app.core.config import settings
    monkeypatch.setattr(settings, "GITHUB_CLIENT_ID", "your_github_client_id")

    # Mock Beanie getters to avoid CollectionWasNotInitialized
    # monkeypatch.setattr(User, "get_pymongo_collection", lambda *args: None)

    # Mock User find_one and insert
    async def mock_find_one(*args, **kwargs):
        return None

    async def mock_insert(self, *args, **kwargs):
        return self

    monkeypatch.setattr(User, "find_one", mock_find_one)
    monkeypatch.setattr(User, "insert", mock_insert)

    # Mock auth_service.create_user_tokens
    async def mock_create_user_tokens(*args, **kwargs):
        return TokenResponse(access_token="mock_access_token_git", token_type="bearer"), "mock_refresh_token_git"

    monkeypatch.setattr(auth_service, "create_user_tokens", mock_create_user_tokens)

    # Execute login
    response = client.get("/api/v1/oauth/github/login", follow_redirects=False)
    assert response.status_code == 307
    assert "access_token=mock_access_token_git" in response.headers["location"]

    assert "/oauth/callback" in response.headers["location"]
