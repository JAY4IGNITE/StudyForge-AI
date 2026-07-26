import random
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.models.user import EmailOTP
from app.templates.email_builders import (
    build_otp_template,
    build_welcome_template,
    build_password_changed_template,
    build_security_login_template
)

class EmailService:
    @staticmethod
    async def _send_brevo_email(email: str, subject: str, html_content: str) -> bool:
        if not settings.BREVO_API_KEY:
            logger.info(f"[LOCAL DEV EMAIL] Subject: '{subject}' to {email}")
            return True

        url = "https://api.brevo.com/v3/smtp/email"
        headers = {
            "api-key": settings.BREVO_API_KEY,
            "Content-Type": "application/json",
            "accept": "application/json"
        }
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
                    logger.info(f"Successfully dispatched email via Brevo to {email} [{subject}]")
                    return True
                else:
                    logger.error(f"Brevo email dispatch failed: status={res.status_code}, response={res.text}")
                    return False
        except Exception as e:
            logger.error(f"Exception during Brevo email send to {email}: {e}")
            return False

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
        
        # Dispatch formatted email
        await EmailService.send_otp_email(email, otp_code, purpose)
        return otp_code

    @staticmethod
    async def send_otp_email(email: str, otp_code: str, purpose: str):
        action_title = "Verify Your Email" if purpose == "verification" else "Reset Your Password"
        subject = f"{action_title} - StudyForge AI"
        html_content = build_otp_template(otp_code=otp_code, action_title=action_title, expire_minutes=15)
        
        if not settings.BREVO_API_KEY:
            logger.info(f"[LOCAL DEV OTP CODE] {email} ({purpose}): {otp_code}")
            
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_welcome_email(email: str, display_name: str):
        subject = "Welcome to StudyForge AI! 🚀"
        html_content = build_welcome_template(display_name=display_name)
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_password_changed_email(email: str):
        subject = "Password Changed Successfully - StudyForge AI"
        html_content = build_password_changed_template()
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_security_login_alert(email: str, device_info: str = "Web Browser"):
        subject = "Security Alert: New Sign-in Detected - StudyForge AI"
        now_str = datetime.now(timezone.utc).strftime("%b %d, %Y %H:%M UTC")
        html_content = build_security_login_template(device_info=device_info, timestamp_str=now_str)
        await EmailService._send_brevo_email(email, subject, html_content)

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
