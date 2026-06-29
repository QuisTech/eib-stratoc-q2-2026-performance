# EIB Group Training & OD Platform: Architecture & Operations Manual

## 1. Overview
This document serves as the master reference guide for the EIB Group Learning Management System (LMS) and 90-Day Strategic Plan portal. It captures the underlying architecture, deployment strategies, strict security hierarchies, and operational procedures.

## 2. Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth

## 3. Deployment & Infrastructure

### Cloud (Vercel)
- The application is currently deployed on Vercel and connected to a Neon Serverless Postgres database.
- CI/CD is fully automated; pushing to the `main` branch on GitHub triggers an instant deployment.

### On-Premise (Docker / VM)
- A completely self-contained `Dockerfile` and `docker-compose.yml` are provided at the root of the project.
- **Services**: 
  - `lms-app` (The Next.js application running on port 3000)
  - `db` (A secure, containerized PostgreSQL 15 database)
- **Deployment Command**: `docker compose up -d --build`
- **CI/CD Note**: To automate deployments on-premise, the IT department must configure a webhook or GitHub Action to execute the Docker build command on the VM whenever the `main` branch is updated.

## 4. Role-Based Access Control (RBAC) & Hierarchy

### The Roles
The system operates on four strict permission levels:

1. **Learner (`learner`)**: Can enroll in courses, take quizzes, and track personal progress.
2. **Subsidiary Manager (`lead`)**: Can track their own team. They only see data for users who registered under their exact subsidiary.
3. **Directorate Head (`lead` with wildcard access)**: A middle-manager who oversees multiple subsidiaries within a specific directorate (e.g., DCI).
4. **LMS Super Admin (`group_head`)**: The absolute highest level of access. Can see all data across the entire EIB Group.

### The Subsidiary Hierarchy
Subsidiaries are grouped in the UI to securely manage sensitive organizational structures:
*   **Group Leadership**: EIB Group, Directorate of Clandestine & Intelligence
*   **Directorate of Clandestine & Intelligence (DCI)**: DCI - SAC, DCI - PSAP, DCI - RAW, DCI - Intel
*   **Commercial & Operational Subsidiaries**: EIB Stratoc, Luftreiber Automobile, POCTOVA, Briech Atlantic, Briech UAS, Bright FM, BEF

## 5. Security & Access Codes

To prevent unauthorized access to high-level data, the following security checks are hardcoded into the system:

*   **LMS Super Admin**: Restricted **strictly** to `michael.marquis@eibgroup.com`. No one else can register for this role, even if they guess an access code.
*   **EIB Group Head Code**: Any generic Group Head registering under the "EIB Group" subsidiary must provide the code: `EIB-GH-2026`.
*   **DCI Directorate Head Code**: The Director of DCI must provide the code: `DCI-GH-2026` to register and gain wildcard oversight of SAC, PSAP, RAW, and Intel.

### The 90-Day Plan Lockdown
The 90-day strategic presentation pages (`/`, `/dashboard`, `/roadmap`, `/strategy`, `/input`) are sealed inside a secure `(admin)` route group layout. 
*   **Only `michael.marquis@eibgroup.com` can view these pages.**
*   Any other user (staff, subsidiary manager, or even the CTO) who attempts to visit the homepage will be instantly and silently redirected to the `/lms` learning portal.

## 6. Database Operations

### Runtime Initialization
Because build-time migrations fail in some isolated environments, the database tables are **created dynamically at runtime**. 
Every time an authentication request is made (via `app/api/auth/[...all]/route.ts`), the system ensures all necessary tables exist using raw `pg` queries. This guarantees the app will never crash due to a missing table on a fresh on-premise deployment.

### Seed Data
The 17 exact courses and their respective metadata are seeded into the database dynamically. 
If the database ever needs to be manually reset or re-seeded (e.g., on a fresh VM), simply navigate to:
`https://<your-domain>/api/db/setup?reset=true`

## 7. How to Update the System in the Future

### Adding a New Subsidiary
To add a new company or sub-unit, simply open `components/auth-form.tsx` and add the new name to the `SUBSIDIARY_GROUPS` object. It will instantly appear in the dropdown and be fully integrated into the RBAC logic without requiring any database changes.

### Editing Course Content
Course catalog metadata, lesson text, and quizzes are hardcoded as a single source of truth in `lib/lms-content.ts`. To change a price, duration, or a quiz question, simply update that file and commit the code.
