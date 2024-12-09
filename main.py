from fastapi import FastAPI
from api import users, roles, post, category   # This connects the other files to this file
from db.models import user_model, role_model, post_model, category_model
from db.db_setup import async_engine
import asyncio

async def create_tables():
    async with async_engine.begin() as conn:
        await conn.run_sync(user_model.Base.metadata.create_all)
        await conn.run_sync(role_model.Base.metadata.create_all)
        await conn.run_sync(post_model.Base.metadata.create_all)
        await conn.run_sync(category_model.Base.metadata.create_all)

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
app.include_router(roles.router)
app.include_router(post.router)
app.include_router(category.router)
