from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from datetime import datetime, timezone
import uuid

def generate_event_id() -> str:
    return str(uuid.uuid4())

def get_utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class WebSocketMessage(BaseModel):
    type: str = Field(..., description="The event type (e.g., 'interview.message')")
    event_id: str = Field(default_factory=generate_event_id, description="Unique identifier for this event")
    timestamp: str = Field(default_factory=get_utc_now_iso, description="ISO-8601 timestamp")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Event payload data")
    
class WSErrorPayload(BaseModel):
    code: str
    message: str

class WSAuthPayload(BaseModel):
    token: str
