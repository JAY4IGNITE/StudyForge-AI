from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.models.user import User
from app.core.errors import StudyForgeException

security_bearer = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    
    user = await User.get(user_id)
    if not user:
        raise StudyForgeException(code="USER_NOT_FOUND", message="User does not exist", status_code=status.HTTP_404_NOT_FOUND)
        
    return user
