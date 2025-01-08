from fastapi import FastAPI
from api import users, roles, post, category, logins   # This connects the other files to this file
from fastapi.middleware.cors import CORSMiddleware

# IMPORTANT: To run async api with alembic, need to use command:  alembic init -t async alembic
# Allows the files to create tables for async while normal init creates for sync


app = FastAPI(
    title="Penta Blog Service",
    description="Managing a blog website of Penta Global Ltd.",
    version="0.0.1",
    contact={
        "name": "Asif Arman",
        "email": "Asif.arman@northsouth.edu"
    }
)
origins = [
    "http://localhost:5173",  # your frontend URL
    "http://127.0.0.1:5173",  # for localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(users.unsecure_router)
app.include_router(roles.router)
app.include_router(post.router)
app.include_router(category.router)
app.include_router(logins.router)
