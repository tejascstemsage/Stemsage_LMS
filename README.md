# STEMSAGE — MERN Stack (converted from PHP)

School STEM-kit lending portal, converted from the original PHP + MySQL app to
a full **MERN** stack (MongoDB, Express, React, Node.js).

## Folder Structure

```
stem-mern/
├── backend/       # Express REST API + MongoDB (Mongoose) models
├── frontend/      # React app — school-facing portal (login + kit dashboard)
├── adminpanel/    # React app — admin dashboard (kits, schools, assignments, settings)
└── database/      # Schema docs + seed script (creates first admin user)
```

## What maps to what (PHP → MERN)

| Original PHP file              | New location                                              |
|---------------------------------|-------------------------------------------------------------|
| `config.php` (DB, settings)     | `backend/config/db.js`, `backend/models/Setting.js`         |
| `login.php` (school login)      | `frontend/src/pages/Login.jsx` + `backend/controllers/schoolAuthController.js` |
| `index.php` (school dashboard)  | `frontend/src/pages/Dashboard.jsx` + `backend/controllers/kitController.js` (`getMyKits`) |
| `admin/login.php`               | `adminpanel/src/pages/Login.jsx` + `backend/controllers/adminAuthController.js` |
| `admin/index.php` (stats)       | `adminpanel/src/pages/Dashboard.jsx` + `backend/controllers/dashboardController.js` |
| `admin/manage_kits.php`         | `adminpanel/src/pages/ManageKits.jsx` + `backend/controllers/kitController.js` |
| `admin/manage_schools.php`      | `adminpanel/src/pages/ManageSchools.jsx` + `backend/controllers/schoolController.js` |
| `admin/manage_assignments.php`  | `adminpanel/src/pages/ManageAssignments.jsx` + `backend/controllers/assignmentController.js` |
| `admin/settings.php`            | `adminpanel/src/pages/Settings.jsx` + `backend/controllers/settingController.js` |
| `assets/images`, `assets/kits`, `pdfs` | `backend/uploads/branding/`, `backend/uploads/kits/` (served at `/uploads/...`) |

Session-based PHP login (`$_SESSION`) is replaced with **JWT tokens** stored in
`localStorage` and sent as `Authorization: Bearer <token>`.

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup & Run

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env -> set MONGO_URI, JWT_SECRET etc.
npm install
npm run dev          # starts on http://localhost:5000
```

### 2. Seed the first admin user

```bash
cd database
node seed.js
```

This creates:
- Admin login → username: `admin`, password: `admin123` (**change after first login**)
- Default branding settings

### 3. Frontend (school portal)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev          # starts on http://localhost:5173
```

### 4. Admin Panel

```bash
cd adminpanel
cp .env.example .env
npm install
npm run dev          # starts on http://localhost:5174
```

## Usage

- Visit `http://localhost:5174/login` → log in as admin → add schools, add kits,
  assign kits to schools, customize login branding.
- Visit `http://localhost:5173/login` → log in with a school's email/password →
  browse, search and filter assigned kits, watch kit videos, view manuals (PDF),
  and see learning outcomes.

## API Overview

All routes are prefixed with `/api`.

| Method | Route                              | Access  | Description |
|--------|-------------------------------------|---------|--------------|
| POST   | `/admin/auth/login`                | Public  | Admin login |
| POST   | `/school/auth/login`               | Public  | School login |
| GET    | `/settings`                        | Public  | Login page branding |
| PUT    | `/settings`                        | Admin   | Update branding (logo, bg, colors) |
| GET    | `/kits/school`                     | School  | Browse assigned kits (search/filter/paginate) |
| GET/POST/PUT/DELETE | `/kits/admin[...]`   | Admin   | Full kit CRUD |
| GET/POST/PUT/DELETE | `/admin/schools[...]`| Admin   | Full school CRUD |
| GET/POST/DELETE | `/admin/assignments[...]` | Admin | Assign/remove kits per school |
| GET    | `/admin/dashboard/stats`           | Admin   | Dashboard counters & charts |

## Notes

- Passwords are hashed with `bcryptjs` (same idea as PHP's `password_hash`).
- File uploads (kit images, manual PDFs, branding images) use `multer` and are
  served statically from `backend/uploads/`.
- This is a functional rebuild of the original PHP app's features — visual styling
  was redesigned for a modern React UI rather than pixel-copied from the PHP HTML.
