"""Update timestamps with server_default and timezone

Revision ID: 7fba6db9da7c
Revises: 2635a35912b1
Create Date: 2024-12-10 17:32:16.541851

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7fba6db9da7c'
down_revision: Union[str, None] = '2635a35912b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None




def upgrade():
    # Update 'created_at' and 'updated_at' to TIMESTAMP WITH TIME ZONE with server defaults
    op.alter_column('users', 'created_at', type_=sa.TIMESTAMP(timezone=True), server_default=sa.func.now(), existing_type=sa.TIMESTAMP(timezone=False))
    op.alter_column('users', 'updated_at', type_=sa.TIMESTAMP(timezone=True), server_default=sa.func.now(), existing_type=sa.TIMESTAMP(timezone=False), onupdate=sa.func.now())
    op.alter_column('posts', 'created_at', type_=sa.TIMESTAMP(timezone=True), server_default=sa.func.now(), existing_type=sa.TIMESTAMP(timezone=False))
    op.alter_column('posts', 'updated_at', type_=sa.TIMESTAMP(timezone=True), server_default=sa.func.now(), existing_type=sa.TIMESTAMP(timezone=False), onupdate=sa.func.now())


def downgrade():
    # Revert 'created_at' and 'updated_at' to TIMESTAMP WITHOUT TIME ZONE without server defaults
    op.alter_column('users', 'created_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True), server_default=None)
    op.alter_column('users', 'updated_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True), server_default=None, onupdate=None)
    op.alter_column('posts', 'created_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True), server_default=None)
    op.alter_column('posts', 'updated_at', type_=sa.TIMESTAMP(timezone=False), existing_type=sa.TIMESTAMP(timezone=True), server_default=None, onupdate=None)