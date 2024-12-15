"""new null changes

Revision ID: 88bcd534486b
Revises: 0d19e83a698b
Create Date: 2024-12-12 17:32:40.319186

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '88bcd534486b'
down_revision: Union[str, None] = '0d19e83a698b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Change 'password' column to be nullable
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password', nullable=True)


def downgrade():
    # Revert 'password' column to NOT NULL
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password', nullable=False)