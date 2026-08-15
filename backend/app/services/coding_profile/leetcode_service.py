import httpx
from typing import Dict, Any

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"


async def fetch_leetcode_stats(username: str) -> Dict[str, Any]:
    query = """
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            username
            profile {
                ranking
                reputation
                starRating
            }
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
            badges {
                name
                icon
            }
        }
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
        }
    }
    """

    variables = {"username": username}

    async with httpx.AsyncClient() as client:
        response = await client.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": query, "variables": variables},
            headers={
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
            },
        )

        response.raise_for_status()
        data = response.json()

        if "errors" in data:
            raise Exception(f"LeetCode API error: {data['errors']}")

        if not data.get("data") or not data["data"].get("matchedUser"):
            raise ValueError(f"User {username} not found on LeetCode")

        matched_user = data["data"]["matchedUser"]
        contest_ranking = data["data"].get("userContestRanking") or {}

        # Transform into a structured format
        ac_submissions = {
            item["difficulty"]: item["count"]
            for item in matched_user["submitStats"]["acSubmissionNum"]
        }

        return {
            "username": matched_user["username"],
            "ranking": matched_user["profile"]["ranking"],
            "reputation": matched_user["profile"]["reputation"],
            "starRating": matched_user["profile"]["starRating"],
            "solved": {
                "all": ac_submissions.get("All", 0),
                "easy": ac_submissions.get("Easy", 0),
                "medium": ac_submissions.get("Medium", 0),
                "hard": ac_submissions.get("Hard", 0),
            },
            "badges": matched_user.get("badges", []),
            "contest": {
                "rating": contest_ranking.get("rating"),
                "attended": contest_ranking.get("attendedContestsCount", 0),
                "globalRanking": contest_ranking.get("globalRanking"),
            },
        }


async def verify_leetcode_username(username: str) -> bool:
    try:
        await fetch_leetcode_stats(username)
        return True
    except Exception:
        return False
