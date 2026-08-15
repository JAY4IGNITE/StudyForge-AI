import random
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.templates.email_builders import (
    build_welcome_template,
    build_password_changed_template,
    build_security_login_template,
)

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


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
            "accept": "application/json",
        }
        payload = {
            "sender": {
                "name": settings.BREVO_SENDER_NAME,
                "email": settings.BREVO_SENDER_EMAIL,
            },
            "to": [{"email": email}],
            "subject": subject,
            "htmlContent": html_content,
        }

        try:
            async with httpx.AsyncClient() as client:
                res = await client.post(url, headers=headers, json=payload, timeout=10)
                if res.status_code in (200, 201):
                    logger.info(
                        f"Successfully dispatched email via Brevo to {email} [{subject}]"
                    )
                    return True
                else:
                    logger.error(
                        f"Brevo email dispatch failed: status={res.status_code}, response={res.text}"
                    )
                    return False
        except Exception as e:
            logger.error(f"Exception during Brevo email send to {email}: {e}")
            return False

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
        html_content = build_security_login_template(
            device_info=device_info, timestamp_str=now_str
        )
        await EmailService._send_brevo_email(email, subject, html_content)


email_service = EmailService()
