<div align="center">

# Product Management Portal

**A modern, full-stack product management application — built for developers who care about craft.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0F1C2E?style=for-the-badge&logo=fastapi&logoColor=00C2D4)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React_18-0F1C2E?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-0F1C2E?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
[![GraphQL](https://img.shields.io/badge/GraphQL-0F1C2E?style=for-the-badge&logo=graphql&logoColor=E10098)](https://graphql.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0F1C2E?style=for-the-badge&logo=postgresql&logoColor=4169E1)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-0F1C2E?style=for-the-badge&logo=docker&logoColor=2496ED)](https://docker.com)

</div>

---

## 🗺️ What's Inside

```
FastAPI + Strawberry GraphQL  ·  PostgreSQL (Docker)  ·  React + Vite
Apollo Client  ·  JWT Auth  ·  RBAC  ·  Vitest  ·  i18n EN/FR  ·  Dark/Light Theme
```

---

## 📋 Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| Python | ≥ 3.10 |
| Docker & Docker Compose | Latest stable |
| Git | Any |

---

## 🚀 Quick Start

### 1 · Clone

```bash
git clone https://github.com/YOUR_USERNAME/Product-Management-Portal.git
cd Product-Management-Portal
```

### 2 · Start the Database

```bash
docker-compose up -d
```

### 3 · Backend

```bash
cd backend
python -m venv .venv

# Mac / Linux
source .venv/bin/activate

# Windows
.venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4 · Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5 · Open in Browser

| Service | URL |
|---------|-----|
| React App | http://localhost:5173 |
| FastAPI | http://localhost:8000 |
| GraphQL Playground | http://localhost:8000/graphql |
| Health Check | http://localhost:8000/health |

---

## 🔐 Roles & Permissions

<table>
<tr>
<td width="50%">

### 🔴 ADMIN
- Create / Edit / Delete products
- Manage users
- Change roles
- Delete users

</td>
<td width="50%">

### 🔵 USER
- View all products
- Create & Edit products

</td>
</tr>
</table>

---

## 🧪 Sample Credentials

**Admin**
```
Username : admin1
Password : Admin123!
Role     : ADMIN
```

**Regular User**
```
Username : user123
Password : User123!
Role     : USER
```

---


## 🧪 Testing & Linting

```bash
cd frontend

npm run test   # Vitest unit tests
npm run lint   # ESLint
```

---

## 🐳 Database Management

```bash
docker-compose up -d    # Start
docker ps               # Check status
docker-compose down     # Stop
```

---

