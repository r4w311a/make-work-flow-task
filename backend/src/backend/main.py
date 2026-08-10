from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from .db import engine, get_db, SessionLocal
from .model import Base, User

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user_count = db.scalar(select(User).limit(1))
        if not user_count:
            users = [
                User(name="Hussein", email="hussein@example.com"),
                User(name="Omar", email="omar@example.com"),
                User(name="Anas ", email="anas@example.com"),
                User(name="Leen", email="leen@example.com")
            ]
            db.add_all(users)
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    logger.info("Fetching users from the database")
    try:
        users = db.scalars(select(User)).all()
        logger.info(f"Successfully fetched {len(users)} users")
        return list(users)
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
