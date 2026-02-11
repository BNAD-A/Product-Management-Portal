import logging
from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine
from app.db.base import Base
from app.models.user import User  # noqa
from app.models.product import Product  # noqa

from strawberry.fastapi import GraphQLRouter
from app.graphql.schema import schema
from app.graphql.context import get_context


log = logging.getLogger(__name__)
app = FastAPI(title="PreProject API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/")
def root():
    return {"message": "API is running. Try /docs, /health, /graphql"}


@app.get("/health")
def health():
    return {"status": "UP"}  # requis :contentReference[oaicite:9]{index=9}

@app.on_event("startup")
def on_startup():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        Base.metadata.create_all(bind=engine)
    except Exception:
        log.exception("Database connection failed")
        raise

