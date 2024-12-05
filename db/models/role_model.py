from sqlalchemy.orm import Relationship
from sqlalchemy import Column, Integer, String, Text
from db.db_setup import Base
from user_model import User

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    users = Relationship(User, back_populates="role")