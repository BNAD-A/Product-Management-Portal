# Product Management Portal

A full-stack Product Management application.

This project showcases a complete modern architecture:

* FastAPI + Strawberry GraphQL backend
* PostgreSQL (Docker)
* React + TypeScript frontend (Vite)
* Apollo Client
* JWT Authentication
* Role-based access control (ADMIN / USER)
* Unit testing with Vitest
* i18n (EN / FR)
* Dark / Light theme support

---

# 1. Prerequisites

Make sure the following tools are installed:

* Node.js (>= 18)
* npm
* Python (>= 3.10)
* Docker & Docker Compose
* Git

---

# 2. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Product-Management-Portal.git
cd Product-Management-Portal
```

---

# 3. Start PostgreSQL (Docker)

From the root folder:

```bash
docker-compose up -d
```

To check running containers:

```bash
docker ps
```

To stop containers:

```bash
docker-compose down
```

---

# 4. Backend Setup (FastAPI + GraphQL)

Go to backend folder:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv .venv
```

Activate it:

Windows:

```bash
.venv\Scripts\activate
```

Mac/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn app.main:app --reload
```

Backend available at:

```
http://localhost:8000
```

GraphQL Playground:

```
http://localhost:8000/graphql
```

Health check:

```
http://localhost:8000/health
```

---

# 5. Frontend Setup (React + Vite)

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend available at:

```
http://localhost:5173
```

---

# 6. Run Frontend Tests

From the frontend folder:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

---

# 7. Sample Credentials

Admin account:

```
Username: admin1
Password: Admin123!
Role: ADMIN
```

Regular user (if registered):

```
Username: user1
Password: User123!
Role: USER
```

---

# 8. Roles & Permissions

ADMIN can:

* Create products
* Edit products
* Delete products
* Manage users
* Change roles
* Delete users

USER can:

* View products
* Create products
* Edit products
* Cannot delete products
* Cannot manage users

---

# 9. Project Structure

```
/backend
/frontend
docker-compose.yml
README.md
```

---

# 10. Quick Start (From Scratch)

To run the full project:

1. `docker-compose up -d`
2. Start backend (`uvicorn app.main:app --reload`)
3. Start frontend (`npm run dev`)
4. Login with sample credentials

The application should now be fully operational.

---
