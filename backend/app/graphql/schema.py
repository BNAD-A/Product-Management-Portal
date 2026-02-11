import re
from typing import List, Optional

import strawberry
from strawberry.types import Info
from sqlalchemy import desc

from app.models.user import User, Role
from app.models.product import Product
from app.core.security import hash_password, verify_password, create_access_token


# -------------------------
# Types
# -------------------------
@strawberry.type
class UserType:
    id: str
    username: str
    role: str


@strawberry.type
class LoginResponse:
    token: str
    user: UserType


@strawberry.type
class ProductType:
    id: str
    name: str
    description: Optional[str]
    price: float
    quantity: int


@strawberry.input
class ProductInput:
    name: str
    description: Optional[str] = None
    price: float
    quantity: int


# -------------------------
# Helpers
# -------------------------
def require_auth(info: Info) -> dict:
    user = info.context.get("user")
    if not user:
        raise Exception("Unauthorized")
    return user


def require_admin(info: Info) -> dict:
    u = require_auth(info)
    if u.get("role") != "ADMIN":
        raise Exception("Forbidden")
    return u


def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def validate_product_create(inp: ProductInput) -> None:
    if not inp.name or len(inp.name.strip()) < 2:
        raise Exception("Validation error: name")
    if inp.price < 0:
        raise Exception("Validation error: price")
    if inp.quantity < 0:
        raise Exception("Validation error: quantity")


def validate_product_update(inp: ProductInput) -> None:
    # même règles que create (cahier des charges)
    validate_product_create(inp)


def to_product_type(p: Product) -> ProductType:
    return ProductType(
        id=str(p.id),
        name=p.name,
        description=p.description,
        price=float(p.price),
        quantity=p.quantity,
    )


# -------------------------
# Query
# -------------------------
@strawberry.type
class Query:
    @strawberry.field
    def me(self, info: Info) -> UserType:
        u = require_auth(info)
        return UserType(id=str(u["userId"]), username=u["username"], role=u["role"])

    # US-5.1: auth required + ordered by created_at desc
    @strawberry.field
    def products(self, info: Info) -> List[ProductType]:
        require_auth(info)
        db = info.context["db"]

        rows = db.query(Product).order_by(desc(Product.created_at)).all()
        return [to_product_type(p) for p in rows]

    # US-5.2: productById(id) with not-found + auth required
    @strawberry.field(name="productById")
    def product_by_id(self, info: Info, id: int) -> ProductType:
        require_auth(info)
        db = info.context["db"]

        p = db.query(Product).filter(Product.id == id).first()
        if not p:
            raise Exception("Product not found")
        return to_product_type(p)


# -------------------------
# Mutation
# -------------------------
@strawberry.type
class Mutation:
    # US-4.2 register validations
    @strawberry.mutation
    def register(self, info: Info, username: str, email: str, password: str) -> UserType:
        if not username or len(username.strip()) < 3:
            raise Exception("Validation error: username")
        if not email or not is_valid_email(email):
            raise Exception("Validation error: email")
        if not password or len(password) < 6:
            raise Exception("Validation error: password")

        db = info.context["db"]

        if db.query(User).filter(User.username == username.strip()).first():
            raise Exception("Username already exists")
        if db.query(User).filter(User.email == email.strip().lower()).first():
            raise Exception("Email already exists")

        user = User(
            username=username.strip(),
            email=email.strip().lower(),
            password_hash=hash_password(password),
            role=Role.USER,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        return UserType(id=str(user.id), username=user.username, role=user.role.value)

    # US-4.2 login returns token + user
    @strawberry.mutation
    def login(self, info: Info, username: str, password: str) -> LoginResponse:
        if not username or not password:
            raise Exception("Invalid credentials")

        db = info.context["db"]
        user = db.query(User).filter(User.username == username).first()

        if not user or not verify_password(password, user.password_hash):
            raise Exception("Invalid credentials")

        token = create_access_token(user.id, user.username, user.role.value)
        return LoginResponse(
            token=token,
            user=UserType(id=str(user.id), username=user.username, role=user.role.value),
        )

    # US-5.3 createProduct validations + returns id
    @strawberry.mutation(name="createProduct")
    def create_product(self, info: Info, input: ProductInput) -> ProductType:
        require_auth(info)
        validate_product_create(input)

        db = info.context["db"]
        p = Product(
            name=input.name.strip(),
            description=input.description,
            price=input.price,
            quantity=input.quantity,
        )
        db.add(p)
        db.commit()
        db.refresh(p)
        return to_product_type(p)

    # US-5.4 updateProduct not-found/validation/auth
    @strawberry.mutation(name="updateProduct")
    def update_product(self, info: Info, id: int, input: ProductInput) -> ProductType:
        require_auth(info)
        validate_product_update(input)

        db = info.context["db"]
        p = db.query(Product).filter(Product.id == id).first()
        if not p:
            raise Exception("Product not found")

        p.name = input.name.strip()
        p.description = input.description
        p.price = input.price
        p.quantity = input.quantity

        db.commit()
        db.refresh(p)
        return to_product_type(p)

    # US-5.5 deleteProduct ADMIN-only; USER => Forbidden
    @strawberry.mutation(name="deleteProduct")
    def delete_product(self, info: Info, id: int) -> bool:
        require_admin(info)

        db = info.context["db"]
        p = db.query(Product).filter(Product.id == id).first()
        if not p:
            raise Exception("Product not found")

        db.delete(p)
        db.commit()
        return True


schema = strawberry.Schema(query=Query, mutation=Mutation)
