"""Fix nullable constraint for password column

Revision ID: 44721db73673
Revises: 88bcd534486b
Create Date: 2024-12-12 17:40:56.854403

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '44721db73673'
down_revision: Union[str, None] = '88bcd534486b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password', nullable=False)

def downgrade():
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('password', nullable=True)
