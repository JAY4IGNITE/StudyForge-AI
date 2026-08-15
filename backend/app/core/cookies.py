from fastapi import Response
from app.core.config import settings

REFRESH_COOKIE_NAME = "refresh_token"
# Must match how auth.router is mounted: app.include_router(api_router, prefix="/api")
# where api_router itself has prefix="/v1" and auth.router has prefix="/auth"
# -> final paths are /api/v1/auth/*.
REFRESH_COOKIE_PATH = "/api/v1/auth"


def set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """
    Store the refresh token as an httpOnly cookie so it's inaccessible to
    JavaScript (mitigates XSS token theft). Scoped to /api/auth so it's only
    ever sent on auth endpoints, not every API request.
    """
    is_prod = settings.APP_ENV.lower() == "production"
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=is_prod,  # requires HTTPS in production; allow http locally
        samesite="lax",
        max_age=settings.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60,
        path=REFRESH_COOKIE_PATH,
    )


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)
