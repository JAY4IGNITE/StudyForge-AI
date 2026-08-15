import os
import re

routes_dir = r"c:\Users\ramuv\StudyForge-AI\backend\app\api\routes"

for filename in os.listdir(routes_dir):
    if not filename.endswith(".py"): continue
    
    filepath = os.path.join(routes_dir, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if file needs modifying
    if "from app.db.database import get_session" not in content and "from sqlalchemy.ext.asyncio import AsyncSession" not in content:
        # Add imports
        import_block = "from sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select\nfrom app.db.database import get_session\n"
        
        # Insert after FastAPI imports or at top
        if "from fastapi import" in content:
            content = re.sub(r'(from fastapi import.*?\n)', r'\1' + import_block, content, count=1)
        else:
            content = import_block + content
            
    # Add session: AsyncSession = Depends(get_session) to route signatures if not there
    # It's a bit risky with regex, but we can try to find async def and add it
    def add_session_to_def(match):
        sig = match.group(0)
        if "session: AsyncSession" in sig:
            return sig
        if "(" in sig and ")" in sig:
            if "(current_user" in sig:
                return sig.replace("(current_user", "(session: AsyncSession = Depends(get_session), current_user")
            elif "(req:" in sig or "(request:" in sig or "(response:" in sig:
                return sig.replace("(", "(session: AsyncSession = Depends(get_session), ", 1)
            elif "()" in sig:
                return sig.replace("()", "(session: AsyncSession = Depends(get_session))")
            else:
                # Just add after first paren
                return sig.replace("(", "(session: AsyncSession = Depends(get_session), ", 1)
        return sig

    content = re.sub(r'async def \w+\(.*?\):', add_session_to_def, content)

    # Some basic replacements
    content = content.replace("await user.save()", "await session.commit()")
    content = content.replace("await user.insert()", "session.add(user)\n    await session.commit()")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Processed {filename}")
