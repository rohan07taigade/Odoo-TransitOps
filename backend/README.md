# TransitOps — Smart Transport Operations Platform

TransitOps is a centralized web platform that digitizes the complete lifecycle of transport operations — vehicle registration, driver management, trip dispatching, maintenance, fuel & expense tracking, and analytics — replacing spreadsheets and manual logbooks with a single, rule-enforced system.

Built as an 8-hour hackathon project.

---

## Problem Statement

Logistics companies commonly rely on spreadsheets and manual logs to manage transport operations, leading to:
- Scheduling conflicts and vehicle double-booking
- Underutilized fleet assets
- Missed maintenance windows
- Expired driver licenses going unnoticed
- Inaccurate expense tracking
- Poor operational visibility

TransitOps solves this with one platform covering vehicle/driver lifecycle, dispatch, maintenance, fuel & expenses, and analytics — with business rules enforced at the system level rather than left to manual discipline.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Backend framework | FastAPI |
| Package/env manager | `uv` |
| ORM/Validation | SQLModel |
| Database | PostgreSQL (`asyncpg`) |
| Migrations | Alembic |
| Auth | JWT (`python-jose` + `passlib[bcrypt]`) |
| Background jobs | APScheduler (in-process) |
| CSV export | Python `csv` + `StreamingResponse` |
| PDF export (bonus) | `reportlab` / `weasyprint` |
| Frontend | React + Vite + TypeScript |
| UI components | shadcn/ui + Tailwind CSS |
| Server state | TanStack Query (React Query) |
| Client state | Zustand |
| Forms | `react-hook-form` + `zod` |
| Charts | Recharts |
| Routing | `react-router-dom` v6 |
| Containerization | Docker Compose (postgres + backend + frontend) |

---

## Roles & Permissions (RBAC)

Login is unified — a single login page for all accounts. Roles are assigned by the Super Admin at account creation, not chosen by the user at login.

| Role | Purpose |
|---|---|
| **Admin** | Bootstraps the system; creates user accounts and assigns roles via User Management |
| **Fleet Manager** | Full control over vehicles and maintenance; oversees fleet lifecycle and efficiency |
| **Dispatcher** | Creates and manages trips; assigns an available vehicle + available driver; monitors active deliveries |
| **Safety Officer** | Manages driver profiles, license validity, and safety scores |
| **Financial Analyst** | Manages fuel logs & expenses; reviews cost and ROI reports |

> **Note:** `Driver` is a data entity (a person assigned to trips), not a login role. The system does not issue driver logins in its core scope.

### Permission Matrix

| Module | Admin | Fleet Manager | Dispatcher | Safety Officer | Financial Analyst |
|---|---|---|---|---|---|
| User Management | CRUD | — | — | — | — |
| Vehicles | R | CRUD | R (available only) | R | R |
| Drivers | R | R | R (available only) | CRUD | R |
| Trips | R | R | Create/Dispatch/Complete/Cancel | R | R |
| Maintenance | R | CRUD | — | R | R (cost view) |
| Fuel & Expenses | R | R | Create (linked to trip) | — | CRUD |
| Analytics | All | All | Trip summary | Compliance widgets | Cost/ROI widgets |

---

## Core Modules

1. **Authentication** — Email/password login, JWT-based sessions, role-scoped access
2. **Dashboard** — KPIs (Active Vehicles, Available Vehicles, In Maintenance, Active/Pending Trips, Drivers on Duty, Fleet Utilization %), filters by type/status/region
3. **Fleet (Vehicle Registry)** — CRUD for vehicles; unique registration number; statuses: Available, On Trip, In Shop, Retired
4. **Drivers** — Driver profiles, license validity tracking, safety scores; statuses: Available, On Trip, Off Duty, Suspended
5. **Trips (Dispatcher)** — Trip lifecycle Draft → Dispatched → Completed → Cancelled; live cargo-weight-vs-capacity validation
6. **Maintenance** — Service record logging; auto-transitions vehicle status to In Shop / back to Available
7. **Fuel & Expenses** — Fuel logs, toll/misc expenses, auto-computed total operational cost per vehicle
8. **Analytics** — Fuel efficiency, fleet utilization, operational cost, Vehicle ROI, monthly revenue, top costliest vehicles
9. **Settings & RBAC** — General depot settings; read-only view of the role-permission matrix
10. **User Management** *(Admin only)* — Create accounts, assign roles, set initial passwords

---

## Business Rules

- Vehicle registration number must be unique
- Retired or In Shop vehicles never appear in dispatch selection
- Drivers with expired licenses or Suspended status cannot be assigned to trips
- A vehicle/driver already On Trip cannot be assigned to another trip
- Cargo weight must not exceed the vehicle's maximum load capacity
- Dispatching a trip → vehicle & driver status become On Trip
- Completing a trip → vehicle & driver status revert to Available
- Cancelling a dispatched trip → vehicle & driver status revert to Available
- Creating an active maintenance record → vehicle status becomes In Shop
- Closing maintenance → vehicle status reverts to Available (unless Retired)

All state-transition and validation logic lives in the backend `services/` layer — never in route handlers — so rule enforcement is centralized and consistent.

---

## Project Structure

### Backend

```
transitops-backend/
├── pyproject.toml
├── uv.lock
├── alembic.ini
├── docker-compose.yml
├── .env
├── alembic/versions/
└── app/
    ├── main.py
    ├── core/          # config, security, dependencies (auth/RBAC)
    ├── db/            # session, seed data
    ├── models/        # SQLModel tables: user, vehicle, driver, trip, maintenance, fuel, expense
    ├── schemas/       # request/response schemas
    ├── services/      # business rule enforcement (trip, maintenance, fuel/expense, reports)
    ├── api/v1/        # route handlers per resource
    └── jobs/          # license_reminder.py (bonus)
```

### Frontend

```
transitops-frontend/
├── src/
│   ├── api/            # API client functions per resource
│   ├── auth/           # auth store (zustand), ProtectedRoute
│   ├── components/     # shared UI (KPI cards, StatusBadge, DataTable, Modal)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Fleet/
│   │   ├── Drivers/
│   │   ├── Trips/
│   │   ├── Maintenance/
│   │   ├── FuelExpenses/
│   │   ├── Analytics/
│   │   ├── Settings/
│   │   └── UserManagement/    # Admin-only
│   └── hooks/           # React Query hooks per resource
```

---

## Database Entities

`users`, `vehicles`, `drivers`, `trips`, `maintenance_logs`, `fuel_logs`, `expenses`

Key relationships: `vehicles 1—N trips`, `drivers 1—N trips`, `vehicles 1—N maintenance_logs`, `vehicles 1—N fuel_logs`, `vehicles 1—N expenses`.

---

## Team & Roles

| Role | Focus |
|---|---|
| Backend Developer 1 (Architect) | Schemas, JWT auth, CRUD endpoints, seed data |
| Backend Developer 2 (Operator) | Trip state machine, transactional status updates, dashboard/analytics KPIs |
| Frontend Developer 1 (Framer) | Routing, auth context, protected layout/sidebar, Login screen, Dashboard UI |
| Frontend Developer 2 (Builder) | Data tables/forms — Vehicle Registry, Driver profiles, Trip creation form with validation |

