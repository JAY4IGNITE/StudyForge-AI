import httpx
from typing import Dict, Any

CODEFORCES_API_URL = "https://codeforces.com/api"


async def fetch_codeforces_stats(username: str) -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        # Fetch user info
        info_resp = await client.get(
            f"{CODEFORCES_API_URL}/user.info?handles={username}"
        )
        info_resp.raise_for_status()
        info_data = info_resp.json()

        if info_data.get("status") != "OK" or not info_data.get("result"):
            raise ValueError(f"Codeforces user {username} not found")

        user_info = info_data["result"][0]

        # Fetch user ratings (for contest count)
        rating_resp = await client.get(
            f"{CODEFORCES_API_URL}/user.rating?handle={username}"
        )
        rating_resp.raise_for_status()
        rating_data = rating_resp.json()

        contests = rating_data.get("result", [])

        return {
            "handle": user_info.get("handle"),
            "rating": user_info.get("rating", 0),
            "maxRating": user_info.get("maxRating", 0),
            "rank": user_info.get("rank", "unrated"),
            "maxRank": user_info.get("maxRank", "unrated"),
            "contestCount": len(contests),
            "organization": user_info.get("organization"),
            "friendOfCount": user_info.get("friendOfCount", 0),
            "avatar": user_info.get("avatar"),
        }


async def verify_codeforces_username(username: str) -> bool:
    try:
        await fetch_codeforces_stats(username)
        return True
    except Exception:
        return False
