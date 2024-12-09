from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from db.db_setup import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    is_deleted = Column(Boolean, default=False)  # Soft delete flag

    # Relationships
    posts = relationship("Post", back_populates="category")
