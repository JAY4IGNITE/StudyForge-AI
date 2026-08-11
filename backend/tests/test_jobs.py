import pytest
from app.services.jobs.job_matcher import JobMatcher

def test_job_matcher_strong_match():
    matcher = JobMatcher()
    job_reqs = ["Python", "FastAPI", "MongoDB", "Docker"]
    user_skills = ["python", "javascript", "fastapi", "react", "mongodb", "docker", "aws"]
    
    result = matcher.calculate_match(job_reqs, user_skills, {})
    
    assert result["overall_match_percentage"] > 80
    assert "Python" in result["matched_skills"]
    assert "Docker" in result["matched_skills"]
    assert len(result["missing_skills"]) == 0

def test_job_matcher_partial_match():
    matcher = JobMatcher()
    job_reqs = ["Python", "FastAPI", "AWS", "Kubernetes"]
    user_skills = ["python", "django", "aws"]
    
    result = matcher.calculate_match(job_reqs, user_skills, {})
    
    assert result["overall_match_percentage"] > 40
    assert result["overall_match_percentage"] < 80
    assert "Python" in result["matched_skills"]
    assert "FastAPI" in result["missing_skills"]
    assert "Kubernetes" in result["missing_skills"]

def test_job_matcher_no_requirements():
    matcher = JobMatcher()
    
    result = matcher.calculate_match([], ["python"], {})
    
    assert result["overall_match_percentage"] == 50
    assert len(result["matched_skills"]) == 0
    assert len(result["missing_skills"]) == 0
