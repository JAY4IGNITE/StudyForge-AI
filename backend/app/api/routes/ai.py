from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.ai_service import ai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    reply: str

class GenerateQuestionsRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    count: int = 3

@router.post("/chat", response_model=ChatResponse)
async def chat_with_nvidia_nim(req: ChatRequest):
    """
    Chat endpoint powered by NVIDIA NIM Llama 3.1 70B for the chatbot.
    """
    if not req.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty")
    
    reply = await ai_service.chat_with_mentor(message=req.message, history=req.history)
    return ChatResponse(reply=reply)

@router.post("/generate-questions")
async def generate_questions(req: GenerateQuestionsRequest):
    """
    Generates questions and step-by-step solutions using NVIDIA NIM AI.
    """
    questions = await ai_service.generate_questions_and_solutions(
        topic=req.topic,
        difficulty=req.difficulty,
        count=req.count
    )
    return {"topic": req.topic, "questions": questions}
