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

### Editing & Creating Course Content (Generative Engine)
The LMS uses a "Generative Learning Engine" to drastically reduce administrative overhead. 
*   **Creating Courses**: You do not need to manually write lessons or build quizzes. A Group Head or Admin can navigate to `Admin Dashboard -> Create New Course` (`/courses/new`). Simply input the title, description, and category. Once published, the system automatically synthesizes a 5-lesson structure and a specialized quiz for that course based on its category (e.g., Intelligence & Security, Technical, Leadership).
*   **Modifying Quizzes**: To update the quiz bank or the lesson generator template, edit the `lib/lms-content.ts` file.

### Automated Onboarding Pipeline
The platform intercepts user registration to automate mandatory training:
*   **Global Standard**: Every new hire is automatically enrolled in the *EIB Group Global Orientation* course the moment they sign up.
*   **Subsidiary-Specific Tracks**: The system reads the user's selected subsidiary and automatically enrolls them in specialized tracks. For example, DCI recruits are instantly enrolled in *Special Operations Brief* (SAC), *Information Security & Clearance Protocols* (RAW), or *Public Safety Comms* (PSAP) without requiring manual intervention.

## 8. Operations & Troubleshooting Log (July 2026)

During initial staging and production deployment, several operational challenges were documented to aid future administration:

### A. Better Auth `admin()` Plugin Failures (422 Errors)
*   **Symptom**: `422 - Failed to create user` appearing sporadically during registration or password resets.
*   **Root Cause**: The official plugin enforced strict internal validation and relied heavily on SMTP verification links, conflicting with the required offline-first / internal network deployment model.
*   **Fix**: The plugin was completely uninstalled. Admin utilities (like forced password resets and cascading user deletion) were rebuilt natively using `better-auth/crypto` to interact directly with the Drizzle ORM models, completely sidestepping the plugin's network requirements.

### B. Multi-Domain CSRF Protection (500 APIErrors)
*   **Symptom**: `Failed to get session` (500 APIError) when accessing the LMS via the on-premise IP or `https://lms.eibstratoc.com`.
*   **Root Cause**: Better Auth's strict CORS/CSRF protection rejected incoming requests because the `BETTER_AUTH_URL` was explicitly defined as the Vercel cloud domain.
*   **Fix**: Replaced the rigid `baseURL` in `lib/auth.ts` with a `trustedOrigins` array, explicitly whitelisting the on-premise IPs and all valid domains. Additionally, Server Components were wrapped in `try/catch` blocks to gracefully log users out if network validation fails, rather than crashing the Next.js renderer.

### C. On-Premise Schema Desync & PM2 Environment Caching
*   **Symptom**: Database queries throwing `Failed query: column X does not exist` immediately after a `git pull` on the Linux VM.
*   **Root Cause**: 
    1. The newly added columns (like `videoUrl` and `customContent` in the Course Builder) were pushed via Drizzle, but `.env.production` was ignored by `.gitignore`. The VM did not receive the new credentials/database pointers.
    2. PM2 (the process manager) permanently caches environment variables upon first launch (`pm2 start`). A simple `pm2 restart` does **not** read `.env.production` if it contradicts PM2's cache.
    3. Neon Postgres introduced `channel_binding=require`, which conflicted with the Linux VM's older Node/pg driver, causing connection timeouts.
*   **Fix**: 
    1. Overwrote `.env.production` on the VM manually and removed the `channel_binding=require` flag.
    2. Flushed PM2's memory completely by running `pm2 delete eib-lms-production` followed by `pm2 start ecosystem.config.js --env production`. This forced PM2 to natively read the fresh connection strings from `.env.production`.
