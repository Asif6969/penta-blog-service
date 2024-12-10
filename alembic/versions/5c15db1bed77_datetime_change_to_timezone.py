"""Datetime change to timezone

Revision ID: 5c15db1bed77
Revises: a719800a33f2
Create Date: 2024-12-10 13:15:25.001584

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5c15db1bed77'
down_revision: Union[str, None] = 'a719800a33f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('users', 'created_at', type_=sa.DateTime(timezone=True))
    op.alter_column('users', 'updated_at', type_=sa.DateTime(timezone=True))
    op.alter_column('posts', 'created_at', type_=sa.DateTime(timezone=True))
    op.alter_column('posts', 'updated_at', type_=sa.DateTime(timezone=True))


def downgrade():
    op.alter_column('users', 'created_at', type_=sa.DateTime(timezone=False))
    op.alter_column('users', 'updated_at', type_=sa.DateTime(timezone=False))
    op.alter_column('posts', 'created_at', type_=sa.DateTime(timezone=False))
    op.alter_column('posts', 'updated_at', type_=sa.DateTime(timezone=False))
