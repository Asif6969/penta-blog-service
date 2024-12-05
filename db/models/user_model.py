from sqlalchemy.orm import Relationship
from sqlalchemy import Column,ForeignKey,Integer,String
from role_model import Role
from mixins import Timestamp
# from post_model import

from db.db_setup import Base


class User(Timestamp, Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username =  Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)

    role = Relationship(Role, back_populates="users", uselist=False)
    post = Relationship("Post", back_populates="users")



