import json
from typing import Optional
from fastapi import WebSocket
from app.core.security import decode_access_token
from app.models.user import User
from app.core.errors import StudyForgeException
from app.core.logging import logger


async def authenticate_websocket(websocket: WebSocket) -> Optional[User]:
    """
    Authenticates a websocket connection.
    Expects the first message to be a JSON object with:
    {
        "type": "auth",
        "token": "<jwt_token>"
    }
    If authentication fails, sends an error and closes the connection.
    """
    try:
        data = await websocket.receive_text()
        parsed = json.loads(data)

        if parsed.get("type") != "auth" or not parsed.get("token"):
            logger.warning(
                "WebSocket authentication failed: Invalid auth message format"
            )
            await websocket.send_json(
                {
                    "type": "connection.error",
                    "payload": {
                        "code": "UNAUTHORIZED",
                        "message": "Authentication required. Expected auth message.",
                    },
                }
            )
            await websocket.close(code=1008)
            return None

        token = parsed["token"]
        try:
            payload = decode_access_token(token)
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Missing subject claim")

            user = await User.get(user_id)
            if not user:
                raise ValueError("User not found")

            logger.info(f"WebSocket authenticated successfully for user: {user.email}")
            return user

        except StudyForgeException as e:
            logger.warning(f"WebSocket authentication failed: {e.message}")
            await websocket.send_json(
                {
                    "type": "connection.error",
                    "payload": {
                        "code": "UNAUTHORIZED",
                        "message": "Invalid or expired token",
                    },
                }
            )
            await websocket.close(code=1008)
            return None
        except Exception as e:
            logger.warning(f"WebSocket authentication failed: {str(e)}")
            await websocket.send_json(
                {
                    "type": "connection.error",
                    "payload": {
                        "code": "UNAUTHORIZED",
                        "message": "Authentication failed",
                    },
                }
            )
            await websocket.close(code=1008)
            return None

    except Exception as e:
        logger.error(f"WebSocket auth flow error: {e}")
        await websocket.close(code=1011)
        return None
