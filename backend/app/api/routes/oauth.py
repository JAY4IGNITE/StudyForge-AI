from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
import httpx
import secrets
from datetime import datetime, timezone
from app.core.config import settings
from app.models.user import User, OAuthState
from app.services.auth_service import auth_service
from app.core.logging import logger

router = APIRouter(prefix="/oauth", tags=["OAuth"])

@router.get("/{provider}/login")
async def oauth_login(provider: str, response: Response):
    state = secrets.token_urlsafe(32)
    oauth_state = OAuthState(state=state, provider=provider)
    await oauth_state.insert()
    
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=600 # 10 mins
    )

    if provider == "google":
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="Google OAuth is not configured")
        
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": f"{settings.BACKEND_URL}/api/v1/oauth/google/callback",
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
            "state": state
        }
        url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
        return RedirectResponse(url)
        
    elif provider == "github":
        if not settings.GITHUB_CLIENT_ID:
            raise HTTPException(status_code=500, detail="GitHub OAuth is not configured")
            
        params = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": f"{settings.BACKEND_URL}/api/v1/oauth/github/callback",
            "scope": "user:email",
            "state": state
        }
        url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
        return RedirectResponse(url)
        
    raise HTTPException(status_code=400, detail="Unsupported OAuth provider")

@router.get("/{provider}/callback")
async def oauth_callback(provider: str, code: str, request: Request, state: str = None):
    # Verify state
    cookie_state = request.cookies.get("oauth_state")
    if not state or not cookie_state or state != cookie_state:
        logger.error(f"OAuth state mismatch for {provider}")
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
        
    # Check if state exists in DB
    db_state = await OAuthState.find_one({"state": state, "provider": provider})
    if not db_state:
        logger.error(f"OAuth state not found in DB for {provider}")
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
    await db_state.delete()
    
    email_verified = False

    if provider == "google":
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{settings.BACKEND_URL}/api/v1/oauth/google/callback",
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                logger.error(f"Google token error: {resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            access_token = resp.json().get("access_token")
            user_info_resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            if user_info_resp.status_code != 200:
                logger.error(f"Google userinfo error: {user_info_resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            user_info = user_info_resp.json()
            email = user_info.get("email")
            name = user_info.get("name")
            oauth_id = user_info.get("sub")
            email_verified = user_info.get("email_verified", False)
            
    elif provider == "github":
        token_url = "https://github.com/login/oauth/access_token"
        data = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": f"{settings.BACKEND_URL}/api/v1/oauth/github/callback",
        }
        headers = {"Accept": "application/json"}
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(token_url, data=data, headers=headers)
            if resp.status_code != 200:
                logger.error(f"GitHub token error: {resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            access_token = resp.json().get("access_token")
            user_info_resp = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
            )
            if user_info_resp.status_code != 200:
                logger.error(f"GitHub userinfo error: {user_info_resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            user_info = user_info_resp.json()
            
            email_resp = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
            )
            if email_resp.status_code != 200:
                logger.error(f"GitHub emails error: {email_resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            emails = email_resp.json()
            if not isinstance(emails, list) or not emails:
                logger.error("GitHub returned empty emails list")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=no_email")
                
            primary_email = next((e for e in emails if e.get("primary")), None)
            if primary_email:
                email = primary_email.get("email")
                email_verified = primary_email.get("verified", False)
            else:
                email = emails[0].get("email")
                email_verified = emails[0].get("verified", False)
            
            name = user_info.get("name") or user_info.get("login")
            oauth_id = str(user_info.get("id"))
    else:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
        
    if not email:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=no_email")
        
    email = email.lower()
    
    # Secure Identity linking
    user = await User.find_one({"auth_provider": provider, "oauth_id": oauth_id})
    if not user:
        if email_verified:
            user = await User.find_one({"email": email})
            if user:
                # Link account
                user.auth_provider = provider
                user.oauth_id = oauth_id
                user.email_verified_at = user.email_verified_at or datetime.now(timezone.utc)
                await user.save()
            else:
                user = User(
                    email=email,
                    display_name=name,
                    auth_provider=provider,
                    oauth_id=oauth_id,
                    password_hash=None,
                    email_verified_at=datetime.now(timezone.utc)
                )
                try:
                    await user.insert()
                except Exception as e:
                    logger.error(f"Failed to insert user {email}: {e}")
                    return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
        else:
            logger.error(f"Email {email} from {provider} is not verified. Rejecting login.")
            return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=unverified_email")
        
    # Create tokens
    tokens = await auth_service.create_user_tokens(user)
    
    # Redirect to frontend callback passing tokens in hash fragment
    # to avoid server log leakage (query params leak, hash does not).
    redirect_url = f"{settings.FRONTEND_URL}/oauth/callback#access_token={tokens.access_token}&refresh_token={tokens.refresh_token}"
    response = RedirectResponse(redirect_url)
    
    # Clear the oauth_state cookie
    response.delete_cookie("oauth_state")
    return response
