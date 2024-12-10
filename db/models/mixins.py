# from datetime import datetime, timezone
from sqlalchemy import Column, DateTime
from sqlalchemy.orm import declarative_mixin
from sqlalchemy.sql import func

@declarative_mixin
class Timestamp:
    # created_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False)
    # updated_at = Column(DateTime(timezone=True), default=datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
