from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class EvaluationRequest(BaseModel):
    question_id: str
    answer_text: str
    session_id: Optional[str] = None

class EvaluationDetailSchema(BaseModel):
    score: float
    semantic_score: float
    strengths: List[str]
    weaknesses: List[str]
    explanation: str
    improvement_advice: str

class EvaluationResponse(BaseModel):
    attempt_id: str
    score: float
    semantic_score: float
    evaluation: EvaluationDetailSchema
    is_mastered: bool = False
    
    class Config:
        from_attributes = True
