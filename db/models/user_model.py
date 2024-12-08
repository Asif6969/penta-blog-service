from sqlalchemy.orm import relationship
from sqlalchemy import Column,ForeignKey,Integer,String, Text
from .mixins import Timestamp
from post_model import Post

from db.db_setup import Base


class User(Timestamp, Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username =  Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    # Relationships
    role = relationship("Role", back_populates="users", uselist=False)
    post = relationship(Post, back_populates="users")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    users = relationship(User, back_populates="roles")
