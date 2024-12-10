"""Datetime change to timezone

Revision ID: 0e753924fc71
Revises: 5c15db1bed77
Create Date: 2024-12-10 13:19:02.063446

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '0e753924fc71'
down_revision: Union[str, None] = '5c15db1bed77'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Change 'created_at' and 'updated_at' to TIMESTAMP WITH TIME ZONE
    op.alter_column('your_table', 'created_at', type_=sa.TIMESTAMP(timezone=True), existing_type=sa.TIMESTAMP(timezone=False))
    op.alter_column('your_table', 'updated_at', type_=sa.TIMESTAMP(timezone=True), existing_type=sa.TIMESTAMP(timezone=False))


def downgrade():
    # Revert 'created_at' and 'updated_at' to TIMESTAMP WITHOUT TIME ZONE
    op.alter_column('your_table', 'created_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True))
    op.alter_column('your_table', 'updated_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True))