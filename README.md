# 🎯 Leads Tracking App

A simple, clean, full-stack application to manage sales leads and notes. Built with **Node.js, Express, TypeScript, SQLite (Prisma ORM)** on the backend and **React, TypeScript, Vite** on the frontend.

---

## ✨ Features

- **Leads CRUD**: Create, read, update status (`new`, `contacted`, `qualified`, `lost`), and delete leads.
- **Notes per Lead**: Add multiple notes to track activity and contact history for each lead.
- **Web Portal**:
  - **Leads List**: Filter by status & live search by name or email.
  - **Lead Detail**: View metadata, update status, and post notes on a chronological timeline.
  - **Create Lead**: Clean form with instant field validation.
- **RESTful API**: Clean JSON API with proper standard HTTP status codes (`200`, `201`, `204`, `400`, `404`).
- **Bonus Features**:
  - 📄 Pagination support (`?page=1&limit=10`)
  - 🔒 Basic Authentication (`BASIC_AUTH_ENABLED=true`)
  - 🧪 Automated API test suite (`Vitest` + `Supertest`)
  - 🐳 Docker & Docker Compose setup

---

## 🔒 Basic Authentication Setup (Optional)

Basic Auth is supported on both the API and Web Portal, with 3 flexible options:

### Option 1: Disabled (Default)
In `server/.env`:
```env
BASIC_AUTH_ENABLED=false
```
All API endpoints and the Web Portal run openly without login popups.

### Option 2: Dynamic Login Screen (UI Popup)
In `server/.env`:
```env
BASIC_AUTH_ENABLED=true
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=change-this-password
```
When an API request returns `401 Unauthorized`, the Web Portal automatically displays a sleek **Authentication Required** login screen. Entering valid credentials saves them to `localStorage` and unlocks access. Click **Sign Out** anytime in the header to clear session credentials.

### Option 3: Static Credentials via Client Environment Variables
In `server/.env`:
```env
BASIC_AUTH_ENABLED=true
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=change-this-password
```
In `client/.env`:
```env
VITE_BASIC_AUTH_USER=admin
VITE_BASIC_AUTH_PASS=change-this-password
```
When `VITE_BASIC_AUTH_USER` and `VITE_BASIC_AUTH_PASS` are provided in `client/.env`, the frontend automatically sends `Authorization: Basic <base64>` header on every request without displaying login dialogs or sign-out buttons.

---

## ⚡ Quick Start (3 Steps)

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 2. Seed Database
Populate SQLite database with initial sample leads and notes:
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```

- 🌐 **Web Portal**: [http://localhost:5173](http://localhost:5173)
- ⚙️ **API URL**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📡 REST API Reference & `curl` Examples

### Base API URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leads` | Get leads (supports `?search=`, `?status=`, `?page=`, `?limit=`) |
| `POST` | `/api/leads` | Create a new lead |
| `GET` | `/api/leads/:id` | Get single lead details |
| `PATCH` | `/api/leads/:id` | Update lead details / status |
| `DELETE` | `/api/leads/:id` | Delete a lead (cascades notes) |
| `GET` | `/api/leads/:id/notes` | Get all notes for a lead |
| `POST` | `/api/leads/:id/notes` | Add a note to a lead |

---

### `curl` Command Examples

#### 1. Get Leads (Search & Filter)
```bash
curl -X GET "http://localhost:5000/api/leads?search=John&status=new"
```

#### 2. Create a Lead
```bash
curl -X POST "http://localhost:5000/api/leads" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "phone": "+1-555-0199",
    "status": "new"
  }'
```

#### 3. Get Lead by ID
```bash
curl -X GET "http://localhost:5000/api/leads/1"
```

#### 4. Update Lead Status
```bash
curl -X PATCH "http://localhost:5000/api/leads/1" \
  -H "Content-Type: application/json" \
  -d '{ "status": "qualified" }'
```

#### 5. Add Note to Lead
```bash
curl -X POST "http://localhost:5000/api/leads/1/notes" \
  -H "Content-Type: application/json" \
  -d '{ "content": "Scheduled follow-up call for next Tuesday." }'
```

#### 6. Get Notes for Lead
```bash
curl -X GET "http://localhost:5000/api/leads/1/notes"
```

#### 7. Delete Lead
```bash
curl -X DELETE "http://localhost:5000/api/leads/1"
```

---

## 🧪 Running Tests

To run the automated API integration test suite:

```bash
npm test
```

---

## 🐳 Running with Docker

You can build and run the entire app containerized with Docker Compose:

```bash
docker-compose up --build
```

Access the app at `http://localhost:5000`.

---

## 🗄️ Database Schema (Prisma / SQLite)

- **Lead**: `id`, `name`, `email`, `phone`, `status` (`new` | `contacted` | `qualified` | `lost`), `createdAt`
- **Note**: `id`, `leadId`, `content`, `createdAt` (relation: `Lead 1 ──< Note`)

---

## 📁 Project Structure

```
leads-tracking-app/
├── package.json         # Root scripts (npm run dev, npm test, npm run seed)
├── Dockerfile           # Multi-stage Docker container build
├── docker-compose.yml   # Docker Compose configuration
├── server/              # Express + TypeScript + Prisma Backend
│   ├── prisma/          # Database schema & seed script
│   └── src/             # Controllers, Services, Validators, Routes, Tests
└── client/              # React + Vite + TypeScript Frontend
    └── src/             # Pages, Components, Services, Styles
```
