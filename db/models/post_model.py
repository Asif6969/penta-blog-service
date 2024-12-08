from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .mixins import Timestamp
from db.db_setup import Base
from user_model import User
from category_model import Category

class Post(Base, Timestamp):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    is_deleted = Column(Boolean, default=False)  # Soft delete flag

    # Relationships
    users = relationship(User, back_populates="posts")
    category = relationship(Category, back_populates="posts")