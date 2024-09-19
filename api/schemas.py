from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    voter = "voter"
    admin = "admin"
    candidate = "candidate"

class Creds(BaseModel):
    username: str
    password: str
    mfa: str 
    
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        orm_mode = True

class ElectionCreate(BaseModel):
    name: str
    start_date: datetime
    end_date: datetime
    description: Optional[str]

class Election(BaseModel):
    id: int
    name: str
    start_date: datetime
    end_date: datetime
    description: Optional[str]

    class Config:
        orm_mode = True