from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode
import httpx
from app.core.config import settings
from app.models.user import User
from app.services.auth_service import auth_service
from app.core.logging import logger

router = APIRouter(prefix="/oauth", tags=["OAuth"])

@router.get("/{provider}/login")
async def oauth_login(provider: str):
    if provider == "google":
        if not settings.GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=500, detail="Google OAuth is not configured")
        
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": f"http://localhost:8000/api/v1/oauth/google/callback",
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent",
        }
        url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
        return RedirectResponse(url)
        
    elif provider == "github":
        if not settings.GITHUB_CLIENT_ID:
            raise HTTPException(status_code=500, detail="GitHub OAuth is not configured")
            
        params = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": f"http://localhost:8000/api/v1/oauth/github/callback",
            "scope": "user:email",
        }
        url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
        return RedirectResponse(url)
        
    raise HTTPException(status_code=400, detail="Unsupported OAuth provider")

@router.get("/{provider}/callback")
async def oauth_callback(provider: str, code: str):
    if provider == "google":
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"http://localhost:8000/api/v1/oauth/google/callback",
        }
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data)
            if resp.status_code != 200:
                logger.error(f"Google token error: {resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            access_token = resp.json().get("access_token")
            user_info_resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            user_info = user_info_resp.json()
            
            email = user_info.get("email")
            name = user_info.get("name")
            oauth_id = user_info.get("sub")
            
    elif provider == "github":
        token_url = "https://github.com/login/oauth/access_token"
        data = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": f"http://localhost:8000/api/v1/oauth/github/callback",
        }
        headers = {"Accept": "application/json"}
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data, headers=headers)
            if resp.status_code != 200:
                logger.error(f"GitHub token error: {resp.text}")
                return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=oauth_failed")
                
            access_token = resp.json().get("access_token")
            user_info_resp = await client.get(
                "https://api.github.com/user",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
            )
            user_info = user_info_resp.json()
            
            email_resp = await client.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
            )
            emails = email_resp.json()
            primary_email = next((e for e in emails if e.get("primary")), None)
            email = primary_email.get("email") if primary_email else emails[0].get("email")
            
            name = user_info.get("name") or user_info.get("login")
            oauth_id = str(user_info.get("id"))
    else:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
        
    if not email:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=no_email")
        
    email = email.lower()
    
    # Check if user exists
    user = await User.find_one({"email": email})
    
    if user:
        if user.auth_provider != provider and user.auth_provider != "local":
            # Just log it or handle account linking
            logger.info(f"User {email} logged in with {provider} but was {user.auth_provider}")
    else:
        # Create new user
        user = User(
            email=email,
            display_name=name,
            auth_provider=provider,
            oauth_id=oauth_id,
            password_hash=None
        )
        await user.insert()
        
    # Create tokens
    tokens = await auth_service.create_user_tokens(user)
    
    # Redirect to frontend callback with tokens
    redirect_url = f"{settings.FRONTEND_URL}/oauth/callback?access_token={tokens.access_token}&refresh_token={tokens.refresh_token}"
    return RedirectResponse(redirect_url)
