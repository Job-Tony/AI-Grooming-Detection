"""convert upload status to enum

Revision ID: dfaa6cd3ded8
Revises: ebcf32b5e677
Create Date: 2026-07-17 09:31:17.887097
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "dfaa6cd3ded8"
down_revision: Union[str, Sequence[str], None] = "ebcf32b5e677"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


upload_status = postgresql.ENUM(
    "UPLOADED",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    name="upload_status",
    create_type=False,
)


def upgrade() -> None:
    """Upgrade schema."""

    # Create PostgreSQL enum
    upload_status.create(op.get_bind(), checkfirst=True)

    # Convert VARCHAR -> ENUM
    op.execute(
        """
        ALTER TABLE uploads
        ALTER COLUMN status TYPE upload_status
        USING status::upload_status;
        """
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Convert ENUM -> VARCHAR
    op.execute(
        """
        ALTER TABLE uploads
        ALTER COLUMN status TYPE VARCHAR(20)
        USING status::text;
        """
    )

    # Drop enum type
    upload_status.drop(op.get_bind(), checkfirst=True)