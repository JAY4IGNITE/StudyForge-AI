from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionGenerationRequest(BaseModel):
    topic: str
    difficulty: str
    user_goal: Optional[str] = None
    target_role: Optional[str] = None
    recent_accuracy: Optional[float] = 0.5

class GeneratedQuestion(BaseModel):
    prompt: str
    expected_concepts: List[str]
    rubric: str
    citations: List[str] = Field(default_factory=list)
    difficulty: str

class AnswerEvaluationRequest(BaseModel):
    question_prompt: str
    expected_concepts: List[str]
    rubric: str
    user_answer: str
    difficulty: str

class AnswerEvaluation(BaseModel):
    score: float = Field(ge=0, le=100)
    semantic_score: float = Field(ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    explanation: str
    improvement_advice: str

class InterviewTurnRequest(BaseModel):
    target_role: str
    interview_type: str
    history: List[dict] = Field(default_factory=list)
    user_answer: Optional[str] = None

class InterviewTurnResponse(BaseModel):
    interviewer_question: str
    feedback_on_previous: Optional[str] = None
    is_completed: bool = False
    overall_summary: Optional[str] = None
