from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from hashlib import md5

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def login(db: Session, cred: schemas.Creds):
    user = db.query(models.User).filter(models.User.username == cred.username).first()

    if user.password_hash == pwd_context.hash(cred.password):
        return user
    return { "error": "invalid credentials"}

def getUser(db: Session):
    return db.query(models.User).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = 
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        role=models.UserRole.voter
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_election(db: Session, election: schemas.ElectionCreate):
    db_election = models.Election(**election.dict())
    db.add(db_election)
    db.commit()
    db.refresh(db_election)
    return db_election
