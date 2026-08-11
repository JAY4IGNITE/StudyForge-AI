import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional

from app.models.coding_profile import CodingProfile, CachedStats
from app.services.coding_profile.leetcode_service import fetch_leetcode_stats, verify_leetcode_username
from app.services.coding_profile.codeforces_service import fetch_codeforces_stats, verify_codeforces_username
from app.services.coding_profile.github_service import fetch_github_stats, verify_github_username

# 15 minute cache expiration
CACHE_TTL_MINUTES = 15

async def sync_profile_stats(profile: CodingProfile, force: bool = False) -> CodingProfile:
    """
    Syncs stats from connected platforms.
    If force=False, only syncs if CACHE_TTL_MINUTES has passed since last sync.
    """
    now = datetime.now(timezone.utc)
    
    if not force and profile.cached_stats.last_synced_at:
        last_synced = profile.cached_stats.last_synced_at.replace(tzinfo=timezone.utc)
        if now - last_synced < timedelta(minutes=CACHE_TTL_MINUTES):
            return profile # Cache is still valid

    tasks = {}
    
    if profile.platforms.leetcode and profile.platforms.leetcode.username:
        tasks["leetcode"] = fetch_leetcode_stats(profile.platforms.leetcode.username)
        
    if profile.platforms.codeforces and profile.platforms.codeforces.username:
        tasks["codeforces"] = fetch_codeforces_stats(profile.platforms.codeforces.username)
        
    if profile.platforms.github and profile.platforms.github.username:
        tasks["github"] = fetch_github_stats(profile.platforms.github.username)

    if not tasks:
        # Nothing to sync
        profile.cached_stats.last_synced_at = now.replace(tzinfo=None)
        await profile.save()
        return profile

    # Run all tasks concurrently
    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    
    # Update cache
    for key, result in zip(tasks.keys(), results):
        if isinstance(result, Exception):
            print(f"Failed to fetch {key} for profile {profile.profile_slug}: {result}")
            # We don't clear the cache on failure, we just keep the old data!
            continue
            
        if key == "leetcode":
            profile.cached_stats.leetcode = result
        elif key == "codeforces":
            profile.cached_stats.codeforces = result
        elif key == "github":
            profile.cached_stats.github = result

    profile.cached_stats.last_synced_at = now.replace(tzinfo=None)
    await profile.save()
    
    return profile
