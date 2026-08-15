import os
import json
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/leetcode", tags=["leetcode"])

POSSIBLE_PATHS = [
    os.path.join(
        os.path.dirname(__file__), "../../../../datasets/interview_problems_1000.json"
    ),
    os.path.join(
        os.path.dirname(__file__), "../../../datasets/interview_problems_1000.json"
    ),
    os.path.abspath("datasets/interview_problems_1000.json"),
]

import aiofiles

_problems_cache: List[dict] = []


async def _load_problems() -> List[dict]:
    global _problems_cache
    if not _problems_cache:
        for path in POSSIBLE_PATHS:
            if os.path.exists(path):
                async with aiofiles.open(path, "r", encoding="utf-8") as f:
                    content = await f.read()
                    _problems_cache = json.loads(content)
                break
    return _problems_cache


@router.get("/problems")
async def get_problems(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    difficulty: Optional[str] = None,
    tag: Optional[str] = None,
    company: Optional[str] = None,
):
    """
    Paginated API endpoint serving 1,000+ technical coding interview questions
    with search, difficulty, category tag, and company filters.
    """
    all_probs = await _load_problems()
    filtered = all_probs

    if search:
        s_lower = search.lower()
        filtered = [
            p
            for p in filtered
            if s_lower in p["title"].lower() or s_lower in p["description"].lower()
        ]

    if difficulty:
        d_lower = difficulty.lower()
        filtered = [p for p in filtered if p["difficulty"].lower() == d_lower]

    if tag:
        t_lower = tag.lower()
        filtered = [
            p
            for p in filtered
            if any(t_lower in tg.lower() for tg in p.get("tags", []))
        ]

    if company:
        c_lower = company.lower()
        filtered = [
            p
            for p in filtered
            if any(c_lower in cmp.lower() for cmp in p.get("companyTags", []))
        ]

    total = len(filtered)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_items = filtered[start_idx:end_idx]

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "problems": paginated_items,
    }


@router.get("/problems/{problem_id}")
async def get_problem_by_id(problem_id: str):
    """Fetches a specific coding problem by ID or slug."""
    all_probs = await _load_problems()
    for p in all_probs:
        if p["id"] == problem_id or p["slug"] == problem_id:
            return p
    raise HTTPException(status_code=404, detail="Coding problem not found")
