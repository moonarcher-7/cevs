from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas, controller
from .db import engine, get_db, Base
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from hashlib import md5
app = FastAPI()

# Configure CORS settings
origins = [
    "http://localhost",  # Allow this domain
    "http://localhost:3000",  # Allow your Next.js app  # Allow your production frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins (or use ["*"] to allow all)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods like GET, POST, PUT, DELETE
    allow_headers=["*"],  # Allow all headers
)


from sqlalchemy.ext.asyncio import AsyncEngine

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Create the database tables
models.Base.metadata.create_all(bind=engine)
description = """
VOTING SYSTEM API
"""



@app.api_route('/login', methods=['POST'])
async def login(cred: schemas.Creds, db: Session = Depends(get_db), ):
    res = controller.login(db, cred)
    return res


@app.get("/users", response_model=List[schemas.User])
async def users(db: Session = Depends(get_db)):
    db_user = controller.getUser(db)
    return db_user

@app.get("/candidates")
async def users(db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.role == 'candidate').all()
    return db_user

@app.post("/users/", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return controller.create_user(db=db, user=user)


@app.delete("/users/{id}")
async def delete_user(id:int, db: Session = Depends(get_db)):
    db_user = controller.delete_user(db, id=id)
    return db_user



@app.post("/elections/", response_model=schemas.Election)
async def create_election(election: schemas.ElectionCreate, db: Session = Depends(get_db)):
    return controller.create_election(db=db, election=election)


@app.put("/status")
def toggle_election_state( db: Session = Depends(get_db)):
    election = db.query(models.Status).filter(models.Status.id == 1).first()

    if not election:
        raise HTTPException(status_code=404, detail="Election not found")

    # Toggle the state
    election.voting = 1 if election.voting == 0 else 0
    db.commit()
    db.refresh(election)

    return {"id": election.id, "is_active": election.voting}

@app.get("/status")
def election_state(db: Session = Depends(get_db)):
    election = db.query(models.Status).filter(models.Status.id == 1).first()

    return election


@app.get("/vote/{voter}/{candidate}")
def election_state(voter:int, candidate:int,db: Session = Depends(get_db)):
    # hash voter -id
    voterId = md5(f'voter-{voter}'.encode()).hexdigest()
    vote = models.Vote(
        voter_id=voterId,
        candidate_id=candidate
    )

    db.add(vote)
    db.commit()

    return vote