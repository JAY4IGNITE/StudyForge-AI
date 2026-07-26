from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_1000_leetcode_problems_paginated():
    response = client.get("/api/v1/leetcode/problems?page=1&limit=20")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert data["total"] == 1000
    assert len(data["problems"]) == 20
    assert data["total_pages"] == 50

def test_leetcode_problems_difficulty_filter():
    response = client.get("/api/v1/leetcode/problems?difficulty=Hard&limit=10")
    assert response.status_code == 200
    data = response.json()
    for p in data["problems"]:
        assert p["difficulty"].lower() == "hard"

def test_leetcode_problems_company_filter():
    response = client.get("/api/v1/leetcode/problems?company=Google&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    for p in data["problems"]:
        assert any("google" in c.lower() for c in p["companyTags"])

def test_leetcode_get_single_problem():
    response = client.get("/api/v1/leetcode/problems/prob_0001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "prob_0001"
    assert "1. Two Sum" in data["title"]
