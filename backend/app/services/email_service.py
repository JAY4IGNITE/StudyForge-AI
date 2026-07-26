import random
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.models.user import EmailOTP

class EmailService:
    @staticmethod
    async def generate_and_save_otp(email: str, purpose: str = "verification") -> str:
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        # Save OTP to database
        otp_entry = EmailOTP(
            email=email,
            purpose=purpose,
            otp_code=otp_code,
            expires_at=expires_at
        )
        await otp_entry.insert()
        
        # Dispatch email via Brevo or log locally
        await EmailService.send_otp_email(email, otp_code, purpose)
        return otp_code

    @staticmethod
    async def send_otp_email(email: str, otp_code: str, purpose: str):
        if not settings.BREVO_API_KEY:
            logger.info(f"[LOCAL DEV OTP] Sent '{purpose}' OTP to {email}: {otp_code}")
            return

        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "api-key": settings.BREVO_API_KEY,
            "Content-Type": "application/json",
            "accept": "application/json"
        }
        subject = "StudyForge AI - Email Verification OTP" if purpose == "verification" else "StudyForge AI - Password Reset OTP"
        html_content = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>StudyForge AI</h2>
            <p>Your OTP code for <strong>{purpose}</strong> is:</p>
            <h1 style="color: #4F46E5; letter-spacing: 4px;">{otp_code}</h1>
            <p>This code expires in 15 minutes.</p>
        </div>
        """
        payload = {
            "sender": {"name": settings.BREVO_SENDER_NAME, "email": settings.BREVO_SENDER_EMAIL},
            "to": [{"email": email}],
            "subject": subject,
            "htmlContent": html_content
        }

        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(url, headers=headers, json=payload, timeout=10)
                if res.status_code in (200, 201):
                    logger.info(f"Successfully sent OTP email via Brevo to {email}")
                else:
                    logger.error(f"Brevo email sending failed: {res.status_code} - {res.text}")
        except Exception as e:
            logger.error(f"Exception during Brevo email send: {e}")

    @staticmethod
    async def verify_otp(email: str, otp_code: str, purpose: str) -> bool:
        otp_entry = await EmailOTP.find_one(
            EmailOTP.email == email,
            EmailOTP.purpose == purpose,
            EmailOTP.consumed_at == None
        )
        if not otp_entry:
            return False

        if datetime.now(timezone.utc) > otp_entry.expires_at.replace(tzinfo=timezone.utc):
            return False

        if otp_entry.otp_code != otp_code:
            otp_entry.attempt_count += 1
            await otp_entry.save()
            return False

        otp_entry.consumed_at = datetime.now(timezone.utc)
        await otp_entry.save()
        return True

email_service = EmailService()
