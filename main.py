from fastapi import FastAPI



app = FastAPI(
    title="Penta Blog Service",
    description="Managing a blog website of Penta Global Ltd.",
    version="0.0.1",
    contact={
        "name": "Asif Arman",
        "email": "Asif.arman@northsouth.edu"
    }
)
