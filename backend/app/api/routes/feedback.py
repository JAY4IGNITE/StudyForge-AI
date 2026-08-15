from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from app.api.deps import get_current_user
from app.models.user import User
from app.models.feedback import Feedback

router = APIRouter(prefix="/feedback", tags=["Feedback"])


class SubmitFeedbackRequest(BaseModel):
    category: str = "platform"
    rating: int = Field(ge=1, le=5)
    comment: str


@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    req: SubmitFeedbackRequest, user: User = Depends(get_current_user)
):
    fb = Feedback(
        user_id=str(user.id),
        category=req.category,
        rating=req.rating,
        comment=req.comment,
    )
    await fb.insert()
    return {"message": "Thank you for your feedback!", "feedback_id": str(fb.id)}
