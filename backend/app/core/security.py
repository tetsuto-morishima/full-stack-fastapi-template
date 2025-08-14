    """
    安全なランダムパスワードを生成する
    """
    alphabet = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(alphabet) for _ in range(length))
from datetime import datetime, timedelta, timezone
from typing import Any, Union
import secrets
import string

from jose import jwt
import requests
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_google_token(id_token: str) -> dict | None:
    """GoogleのIDトークンを検証し、ユーザー情報（sub, email, name等）返却"""
    try:
        response = requests.get(
            "https://oauth2.googleapis.com/tokeninfo", params={"id_token": id_token}
        )
        if response.status_code == 200:
            return response.json()
    except Exception:
        pass
    return None


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
