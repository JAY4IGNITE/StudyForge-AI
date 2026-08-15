import os
import re

routes_dir = r"c:\Users\ramuv\StudyForge-AI\backend\app\api\routes"

def refactor_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add SQLAlchemy imports if not present
    if "from app.db.database import get_session" not in content:
        import_block = "from sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select\nfrom app.db.database import get_session\nimport uuid\n"
        if "from fastapi import" in content:
            content = re.sub(r'(from fastapi import.*?\n)', r'\1' + import_block, content, count=1)
        else:
            content = import_block + content
    elif "import uuid" not in content:
        content = "import uuid\n" + content

    # 2. Add `session: AsyncSession = Depends(get_session)` to route handlers
    def add_session(match):
        sig = match.group(0)
        if "session: AsyncSession" in sig: return sig
        # Determine where to insert it: to the end of the argument list, before the closing )
        if "(" in sig and "):" in sig:
            if "()" in sig:
                return sig.replace("():", "(session: AsyncSession = Depends(get_session)):")
            else:
                return sig.replace("):", ", session: AsyncSession = Depends(get_session)):")
        return sig
    
    content = re.sub(r'async def \w+\(.*?\):', add_session, content)

    # Replace `from bson import ObjectId` and `ObjectId(app_id)`
    content = re.sub(r'from bson import ObjectId\n?', '', content)
    content = re.sub(r'ObjectId\((.*?)\)', r'uuid.UUID(\1)', content)
    content = re.sub(r'except Exception as e:', r'except Exception as e:', content)

    # Replace `.find_one(...)`
    def replace_find_one(match):
        model = match.group(1)
        args = match.group(2)
        if "{" in args and "}" in args:
            # Very basic dict to kwarg transformation
            args = args.replace('{"', '').replace('": ', ' == ').replace('}', '')
            # Try to prepend Model.
            args = f"{model}." + args.strip()
        return f"(await session.execute(select({model}).where({args}))).scalars().first()"

    content = re.sub(r'await (\w+)\.find_one\((.*?)\)', replace_find_one, content)

    # Replace `.get(...)`
    def replace_get(match):
        model = match.group(1)
        args = match.group(2)
        # If args already has uuid.UUID, fine, else wrap it
        if "uuid" not in args:
            args = f"uuid.UUID({args})" if "str" not in args else args.replace("str(", "uuid.UUID(")
        return f"(await session.execute(select({model}).where({model}.id == {args}))).scalars().first()"
    
    content = re.sub(r'await (\w+)\.get\((.*?)\)', replace_get, content)

    # Replace `.find(...).to_list()`
    def replace_find_list(match):
        model = match.group(1)
        args = match.group(2)
        if not args:
            return f"(await session.execute(select({model}))).scalars().all()"
        return f"(await session.execute(select({model}).where({args}))).scalars().all()"
    
    content = re.sub(r'await (\w+)\.find\((.*?)\)\.to_list\(\)', replace_find_list, content)
    content = re.sub(r'await (\w+)\.find\((.*?)\)\.to_list\(length=None\)', replace_find_list, content)
    content = re.sub(r'await (\w+)\.find_all\(\)\.to_list\(\)', r'(await session.execute(select(\1))).scalars().all()', content)

    content = re.sub(r'await (\w+)\.insert\(\)', r'session.add(\1)\n    await session.commit()', content)
    content = re.sub(r'await (\w+)\.save\(\)', r'await session.commit()', content)
    content = re.sub(r'await (\w+)\.delete\(\)', r'await session.delete(\1)\n    await session.commit()', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

for filename in os.listdir(routes_dir):
    if filename.endswith(".py"):
        refactor_file(os.path.join(routes_dir, filename))
        print(f"Processed {filename}")
