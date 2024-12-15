from sqlalchemy.orm import relationship
from sqlalchemy import Column,ForeignKey,Integer,String, Text
from .mixins import Timestamp

from db.db_setup import Base


class User(Timestamp, Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username =  Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    # Relationships
    roles = relationship("Role", back_populates="users", uselist=False)
    posts = relationship("Post", back_populates="users")