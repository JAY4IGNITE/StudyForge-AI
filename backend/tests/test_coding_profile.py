import pytest
from datetime import datetime, timezone, timedelta
from app.models.coding_profile import CodingProfile, ConnectedPlatforms, PlatformConnection, CachedStats
from app.services.coding_profile.aggregator_service import sync_profile_stats
from unittest.mock import MagicMock
import uuid

@pytest.fixture
def mock_profile():
    profile = MagicMock(spec=CodingProfile)
    profile.user_id = uuid.uuid4()
    profile.display_name = "Test User"
    profile.profile_slug = "test-user"
    
    platforms = ConnectedPlatforms(
        leetcode=PlatformConnection(username="test_lc", verified=True)
    )
    profile.platforms = platforms
    
    cached_stats = CachedStats(
        last_synced_at=datetime.now(timezone.utc) - timedelta(minutes=20)
    )
    profile.cached_stats = cached_stats
    
    async def mock_save(*args, **kwargs):
        pass
    profile.save = mock_save
    
    return profile

@pytest.mark.asyncio
async def test_sync_stats_cache_valid(mock_profile, monkeypatch):
    # Set cache to be valid (only 5 mins old)
    mock_profile.cached_stats.last_synced_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    
    # Mock save to prevent DB issues in test
    async def mock_save(*args, **kwargs):
        pass
    mock_profile.save = mock_save
    
    # Mock fetch so we know if it was called
    fetch_called = False
    async def mock_fetch(*args):
        nonlocal fetch_called
        fetch_called = True
        return {"username": "test"}
    monkeypatch.setattr("app.services.coding_profile.aggregator_service.fetch_leetcode_stats", mock_fetch)
    
    result = await sync_profile_stats(mock_profile, force=False)
    
    # Since cache is valid, fetch should NOT be called
    assert not fetch_called
    assert result == mock_profile

@pytest.mark.asyncio
async def test_sync_stats_force(mock_profile, monkeypatch):
    # Set cache to be valid
    mock_profile.cached_stats.last_synced_at = datetime.now(timezone.utc) - timedelta(minutes=5)
    
    async def mock_save(*args, **kwargs):
        pass
    monkeypatch.setattr(CodingProfile, "save", mock_save)
    
    fetch_called = False
    async def mock_fetch(*args):
        nonlocal fetch_called
        fetch_called = True
        return {"username": "test_lc", "solved": {"all": 100}}
    monkeypatch.setattr("app.services.coding_profile.aggregator_service.fetch_leetcode_stats", mock_fetch)
    
    # Force=True should bypass the cache check
    result = await sync_profile_stats(mock_profile, force=True)
    
    assert fetch_called
    assert result.cached_stats.leetcode["solved"]["all"] == 100
