"""enable rls on all tables

Revision ID: 8fb810588087
Revises: eb54dacde2b6
Create Date: 2026-08-15 21:19:41.546103

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8fb810588087'
down_revision: Union[str, Sequence[str], None] = 'eb54dacde2b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    tables = [
        "alembic_version",
        "ats_reports",
        "attempts",
        "coding_profiles",
        "email_otps",
        "feedback",
        "interview_reports",
        "interview_sessions",
        "job_applications",
        "mastery_profiles",
        "oauth_states",
        "practice_sessions",
        "questions",
        "refresh_tokens",
        "resources",
        "resume_analyses",
        "resumes",
        "topics",
        "user_roadmaps",
        "users"
    ]
    for table in tables:
        op.execute(f'ALTER TABLE "{table}" ENABLE ROW LEVEL SECURITY;')


def downgrade() -> None:
    """Downgrade schema."""
    tables = [
        "alembic_version",
        "ats_reports",
        "attempts",
        "coding_profiles",
        "email_otps",
        "feedback",
        "interview_reports",
        "interview_sessions",
        "job_applications",
        "mastery_profiles",
        "oauth_states",
        "practice_sessions",
        "questions",
        "refresh_tokens",
        "resources",
        "resume_analyses",
        "resumes",
        "topics",
        "user_roadmaps",
        "users"
    ]
    for table in tables:
        op.execute(f'ALTER TABLE "{table}" DISABLE ROW LEVEL SECURITY;')
