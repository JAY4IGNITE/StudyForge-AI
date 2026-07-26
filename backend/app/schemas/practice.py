from pydantic import BaseModel
from typing import Optional

class StartSessionRequest(BaseModel):
    topic_id: str
    target_difficulty: Optional[str] = "medium"

class SubmitAnswerRequest(BaseModel):
    question_id: str
    answer_text: str
    duration_seconds: int = 0
