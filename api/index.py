from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas, controller
from .db import engine, get_db, Base
from typing import List


from sqlalchemy.ext.asyncio import AsyncEngine

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Create the database tables
models.Base.metadata.create_all(bind=engine)
description = """
VOTING SYSTEM API"""
app = FastAPI(title='Voting Api',description=description)


@app.post('/login')
async def login(cred: schemas.Creds, db: Session = Depends(get_db), ):
    res = controller.login(db, cred)
    return res


@app.get("/users", response_model=List[schemas.User])
async def users(db: Session = Depends(get_db)):
    db_user = controller.getUser(db)
    return db_user

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return controller.create_user(db=db, user=user)



@app.post("/elections/", response_model=schemas.Election)
async def create_election(election: schemas.ElectionCreate, db: Session = Depends(get_db)):
    return controller.create_election(db=db, election=election)
