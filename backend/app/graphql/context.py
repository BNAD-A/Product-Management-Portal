from fastapi import Request
from app.db.session import SessionLocal
from app.core.security import decode_token


async def get_context(request: Request) -> dict:
    print("AUTH HEADER:", request.headers.get("authorization"))

    db = SessionLocal()

    user = None
    auth = request.headers.get("authorization") or ""
    if auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1].strip()
        try:
            user = decode_token(token)
        except Exception:
            user = None

    return {"request": request, "db": db, "user": user}
