from fastapi import FastAPI
from api import users    # This connects the other files to this file
# from db.models import user_model

app = FastAPI(
    title="Penta Blog Service",
    description="Managing a blog website of Penta Global Ltd.",
    version="0.0.1",
    contact={
        "name": "Asif Arman",
        "email": "Asif.arman@northsouth.edu"
    }
)

app.include_router(users.router)