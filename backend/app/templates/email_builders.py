from app.templates.email_base import get_base_email_layout

def build_otp_template(otp_code: str, action_title: str, expire_minutes: int = 15) -> str:
    body = f"""
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0; text-align: center;">
      {action_title}
    </h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; text-align: center;">
      Use the following 6-digit verification code to complete your action on <strong>StudyForge AI</strong>.
    </p>

    <div class="otp-box">
      <div class="otp-code">{otp_code}</div>
    </div>

    <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-bottom: 0;">
      ⏰ This code expires in <strong>{expire_minutes} minutes</strong>. Do not share this code with anyone.
    </p>
    """
    return get_base_email_layout(title=action_title, preheader=f"Your verification code is {otp_code}", content_body=body)

def build_welcome_template(display_name: str) -> str:
    body = f"""
    <h2 style="color: #f8fafc; font-size: 24px; font-weight: 800; margin-top: 0; text-align: center;">
      Welcome to StudyForge AI! 🎉
    </h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
      Hi <strong>{display_name}</strong>,
    </p>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
      Your account has been successfully verified! You now have full access to our adaptive learning ecosystem designed to accelerate your career goals.
    </p>

    <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid #334155; border-radius: 14px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #818cf8; font-size: 16px; margin-top: 0;">What you can do right now:</h3>
      <ul style="color: #cbd5e1; font-size: 14px; padding-left: 20px; margin-bottom: 0; line-height: 1.8;">
        <li>🎯 <strong>Start Practice Loop</strong> - Dynamic questions adapted to your accuracy.</li>
        <li>🎤 <strong>AI Mock Interviews</strong> - Practice multi-turn behavioral & technical interviews.</li>
        <li>📊 <strong>Track Mastery</strong> - View accuracy trends and weak topics on your dashboard.</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 28px;">
      <a href="http://localhost:5173/dashboard" class="btn">Launch Your Dashboard &rarr;</a>
    </div>
    """
    return get_base_email_layout(title="Welcome to StudyForge AI", preheader="Your account is fully activated!", content_body=body)

def build_password_changed_template() -> str:
    body = f"""
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0;">
      Password Changed Successfully
    </h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
      This email confirms that the password for your <strong>StudyForge AI</strong> account was recently updated.
    </p>

    <div style="background-color: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="color: #fb7185; font-size: 13px; margin: 0; font-weight: 500;">
        ⚠️ <strong>Security Notice:</strong> If you did not make this change, please reset your password immediately and contact support.
      </p>
    </div>
    """
    return get_base_email_layout(title="Password Changed", preheader="Your account password was updated.", content_body=body)

def build_security_login_template(device_info: str, timestamp_str: str) -> str:
    body = f"""
    <h2 style="color: #f8fafc; font-size: 22px; font-weight: 700; margin-top: 0;">
      Security Alert: New Sign-in
    </h2>
    <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">
      We detected a new sign-in to your StudyForge AI account.
    </p>

    <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0;">
      <table style="width: 100%; color: #cbd5e1; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #94a3b8; width: 120px;">Time:</td>
          <td style="padding: 6px 0; font-weight: 600; color: #f8fafc;">{timestamp_str}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #94a3b8;">Client/Device:</td>
          <td style="padding: 6px 0; font-weight: 600; color: #f8fafc;">{device_info}</td>
        </tr>
      </table>
    </div>

    <p style="color: #94a3b8; font-size: 13px;">
      If this was you, no action is required. If you don't recognize this activity, please change your password.
    </p>
    """
    return get_base_email_layout(title="Security Alert", preheader="New sign-in detected on your account.", content_body=body)
