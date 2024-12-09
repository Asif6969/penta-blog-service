from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Text
from db.db_setup import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    users = relationship("User", back_populates="roles")

# ERROR: circular import showing loop between user_model and role_model. Plan is to put table role into user.