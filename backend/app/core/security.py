import datetime as dt
import bcrypt
import jwt
from app.core.config import settings, require_jwt_secret

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))

def create_access_token(user_id: int, username: str, role: str) -> str:
    secret = require_jwt_secret()
    exp = dt.datetime.utcnow() + dt.timedelta(minutes=settings.JWT_EXPIRES_MINUTES)
    payload = {"userId": user_id, "username": username, "role": role, "exp": exp}
    return jwt.encode(payload, secret, algorithm="HS256")

def decode_token(token: str) -> dict:
    secret = require_jwt_secret()
    return jwt.decode(token, secret, algorithms=["HS256"])
