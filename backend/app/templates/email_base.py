def get_base_email_layout(title: str, preheader: str, content_body: str) -> str:
    """
    Returns a responsive, premium HTML email wrapper with custom typography,
    branding header, glass-card container, and professional footer.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <!--[if mso]>
  <style type="text/css">
    table {{ border-collapse: collapse; }}
    td {{ font-family: Arial, sans-serif; }}
  </style>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    body {{
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #090d16;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }}
    .preheader {{
      display: none !important;
      max-height: 0;
      overflow: hidden;
      mso-hide: all;
    }}
    .container {{
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }}
    .card {{
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }}
    .header-logo {{
      text-align: center;
      margin-bottom: 32px;
    }}
    .logo-badge {{
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      font-weight: 800;
      font-size: 20px;
      padding: 10px 20px;
      border-radius: 12px;
      letter-spacing: -0.5px;
    }}
    .footer {{
      text-align: center;
      margin-top: 32px;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }}
    .footer a {{
      color: #818cf8;
      text-decoration: none;
    }}
    .btn {{
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 12px;
      text-decoration: none;
      box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
      margin-top: 20px;
    }}
    .otp-box {{
      background-color: #0f172a;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin: 28px 0;
    }}
    .otp-code {{
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #818cf8;
    }}
  </style>
</head>
<body>
  <span class="preheader">{preheader}</span>
  <div class="container">
    <div class="card">
      <div class="header-logo">
        <div class="logo-badge">🔥 StudyForge AI</div>
      </div>

      {content_body}

    </div>

    <div class="footer">
      <p>&copy; 2026 StudyForge AI Inc. Adaptive Learning & Interview Platform.</p>
      <p>Need help? Contact our support team at <a href="mailto:support@studyforge.ai">support@studyforge.ai</a></p>
    </div>
  </div>
</body>
</html>"""
