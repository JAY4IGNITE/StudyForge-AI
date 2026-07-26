import random
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings
from app.core.logging import logger
from app.models.user import EmailOTP

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
                    logger.info(f"Successfully sent email via Brevo to {email} [{subject}]")
                    return True
                else:
                    logger.error(f"Brevo email sending failed: {res.status_code} - {res.text}")
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
        
        # Dispatch email
        await EmailService.send_otp_email(email, otp_code, purpose)
        return otp_code

    @staticmethod
    async def send_otp_email(email: str, otp_code: str, purpose: str):
        if purpose == "verification":
            subject = "Verify Your Email - StudyForge AI"
            action_desc = "email verification"
        else:
            subject = "Reset Your Password - StudyForge AI"
            action_desc = "password reset"

        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #6366f1; margin: 0; font-size: 28px;">StudyForge AI</h1>
                <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Adaptive Learning & Mock Interview Platform</p>
            </div>
            <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
                <p style="font-size: 16px; margin-top: 0;">Your OTP code for <strong>{action_desc}</strong> is:</p>
                <div style="text-align: center; margin: 24px 0;">
                    <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #818cf8; letter-spacing: 8px; background-color: #0f172a; padding: 12px 24px; border-radius: 8px; border: 1px solid #475569;">{otp_code}</span>
                </div>
                <p style="font-size: 13px; color: #94a3b8;">This code expires in 15 minutes. If you did not request this code, please ignore this email.</p>
            </div>
            <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #64748b;">
                &copy; StudyForge AI. All rights reserved.
            </div>
        </div>
        """
        if not settings.BREVO_API_KEY:
            logger.info(f"[LOCAL DEV OTP] Code for {email} ({purpose}): {otp_code}")
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_welcome_email(email: str, display_name: str):
        subject = "Welcome to StudyForge AI! 🚀"
        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #6366f1; margin: 0;">Welcome to StudyForge AI!</h1>
            </div>
            <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
                <p style="font-size: 16px; margin-top: 0;">Hi <strong>{display_name}</strong>,</p>
                <p style="color: #cbd5e1;">We're excited to have you on board! Your account has been fully verified and activated.</p>
                <h3 style="color: #818cf8; margin-top: 20px;">Start exploring your features:</h3>
                <ul style="color: #cbd5e1; line-height: 1.8;">
                    <li>🎯 <strong>Adaptive Practice Loop</strong> - Dynamic questions adapted to your accuracy</li>
                    <li>🎤 <strong>AI Mock Interviews</strong> - Realistic multi-turn interview scenarios</li>
                    <li>📊 <strong>Topic Mastery Analytics</strong> - Track your growth & focus areas</li>
                    <li>📚 <strong>RAG Resource Library</strong> - Access curated study materials</li>
                </ul>
            </div>
        </div>
        """
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_password_changed_email(email: str):
        subject = "Password Changed Successfully - StudyForge AI"
        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
            <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
                <h2 style="color: #f43f5e; margin-top: 0;">Password Changed</h2>
                <p style="color: #cbd5e1;">Your password for your StudyForge AI account was changed successfully.</p>
                <p style="font-size: 13px; color: #94a3b8;">If you did not perform this action, please reset your password immediately or contact support.</p>
            </div>
        </div>
        """
        await EmailService._send_brevo_email(email, subject, html_content)

    @staticmethod
    async def send_security_login_alert(email: str, device_info: str = "Web Browser"):
        subject = "Security Alert: New Login Detected - StudyForge AI"
        now_str = datetime.now(timezone.utc).strftime("%b %d, %Y %H:%M UTC")
        html_content = f"""
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #0f172a; color: #f8fafc; border-radius: 16px;">
            <div style="background-color: #1e293b; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
                <h3 style="color: #fbbf24; margin-top: 0;">New Login to Your Account</h3>
                <p style="color: #cbd5e1;">A new sign-in was detected for your account:</p>
                <ul style="color: #94a3b8; font-size: 14px;">
                    <li><strong>Time:</strong> {now_str}</li>
                    <li><strong>Client/Device:</strong> {device_info}</li>
                </ul>
            </div>
        </div>
        """
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
