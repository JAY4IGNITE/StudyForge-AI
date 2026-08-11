import httpx
from typing import Dict, Any
from app.core.config import settings

GITHUB_API_URL = "https://api.github.com"
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

async def fetch_github_stats(username: str) -> Dict[str, Any]:
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    # If you add GITHUB_TOKEN to settings, use it for higher rate limits
    if hasattr(settings, 'GITHUB_TOKEN') and settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    async with httpx.AsyncClient() as client:
        # Fetch user info
        user_resp = await client.get(f"{GITHUB_API_URL}/users/{username}", headers=headers)
        user_resp.raise_for_status()
        user_data = user_resp.json()
        
        # We can also fetch some repos to calculate total stars if needed,
        # but for now we'll rely on the basic user object which provides public_repos and followers.
        
        # Optional: Use GraphQL to get the contribution calendar if we have a token
        contribution_data = {}
        if headers.get("Authorization"):
            query = """
            query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                  }
                }
              }
            }
            """
            try:
                gql_resp = await client.post(
                    GITHUB_GRAPHQL_URL,
                    json={"query": query, "variables": {"username": username}},
                    headers=headers
                )
                if gql_resp.status_code == 200:
                    gql_data = gql_resp.json()
                    contributions = gql_data.get("data", {}).get("user", {}).get("contributionsCollection", {}).get("contributionCalendar", {})
                    contribution_data["totalContributionsThisYear"] = contributions.get("totalContributions", 0)
            except Exception:
                pass # Fallback if GraphQL fails
                
        return {
            "username": user_data.get("login"),
            "public_repos": user_data.get("public_repos", 0),
            "followers": user_data.get("followers", 0),
            "following": user_data.get("following", 0),
            "avatar_url": user_data.get("avatar_url"),
            "html_url": user_data.get("html_url"),
            **contribution_data
        }

async def verify_github_username(username: str) -> bool:
    try:
        await fetch_github_stats(username)
        return True
    except Exception:
        return False
