from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from hashlib import md5

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def login(db: Session, cred: schemas.Creds):
    user = db.query(models.User).filter(models.User.username == cred.username).first()
    if user is  None:
        return { "error": "invalid credentials"}
    if user.password_hash == md5(cred.password.encode()).hexdigest():
        return user
    return { "error": "invalid credentials1"}        
    

def getUser(db: Session):
    return db.query(models.User).all()

def delete_user(db: Session, id):
    user = db.get(models.User, id)

    if user: 
        db.delete(user)
        db.commit()
        return {"status": "success"}
    return {"error": user}

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=md5(user.password.encode()).hexdigest(),
        role=user.role,
        mfa_secret=user.mfa
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
