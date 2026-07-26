from pydantic import BaseModel
from typing import Optional

class StartInterviewRequest(BaseModel):
    target_role: str
    interview_type: str = "technical"

class SubmitTurnRequest(BaseModel):
    user_answer: str
