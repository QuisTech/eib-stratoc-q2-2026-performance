# EIB Stratoc Q2 2026 Performance - Project Documentation

This document serves as the comprehensive, up-to-date record of the architecture, features, and technical decisions for the **EIB Stratoc Q2 2026 Performance** (LMS) platform.

## 1. Core Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & shadcn/ui components
- **Authentication**: `better-auth` (v1.6.20) with Email/Password & Role-based Access Control (RBAC).
- **Database**: PostgreSQL (Neon/Local) managed via Drizzle ORM.
- **Deployment**: 
  - **Cloud**: Vercel (for internet-facing access)
  - **On-Premise / VM Ready**: Designed to run entirely offline on an internal network via `npm run start` and PM2.

## 2. Key Features Implemented

### A. Role-Based Access Control (RBAC)
The platform supports hierarchical access levels:
- **Learner**: Can enroll in courses, view modules, and take quizzes.
- **Lead**: Elevated privileges for team oversight.
- **Group Head / Admin**: Full access to the Admin Dashboard, course creation, sync controls, and learner password management.

### B. Custom Course Builder (Offline-First)
- **Static/Programmatic Generation**: Instead of relying on external LLMs that require internet access, the platform includes a deterministic course builder.
- **Rich Content Attachments**: Group Heads can attach URLs and text content to lessons.
- **Schema**: Supports robust relational data models linking `Course` -> `Module` -> `Lesson` -> `Quiz`.

### C. Password Management (Email-less Failsafe)
Designed specifically for the constraints of an on-premise, internal deployment where setting up an SMTP email server is undesirable:
- **Self-Service**: Logged-in users can change their password securely from the `/lms/settings` page.
- **Admin Failsafe Reset**: Group Heads can instantly force-reset a forgotten user's password from the Admin Dashboard to a configurable temporary default (e.g., `ChangeMeImmediately123!`).

### D. Hybrid Sync Engine (Cloud ↔ On-Premise)
To ensure the on-premise database and the cloud database remain identical:
- **Upsert Logic**: Uses Postgres `ON CONFLICT DO UPDATE` to safely merge records without duplication.
- **Manual Sync**: A "Click to Sync" button on the Admin Dashboard for instant synchronization.
- **Automated Background Sync**: An authenticated `/api/sync/run` endpoint designed to be triggered by a local `crontab` every 15 minutes, ensuring invisible, continuous alignment between the offline VM and the cloud.

### E. Analytics & Reporting
Robust oversight tools for Group Heads built directly into the Admin Dashboard:
- **Detailed CSV Exports**: Admins can generate and download a comprehensive CSV report containing all learner details, enrollments, progress, and statuses.
- **Public Certificate Verification**: The CSV report contains dynamically generated, secure URLs to each completed learner's certificate. Because these links use an unguessable CUID, certificates can be securely shared with and verified by third parties (e.g., HR or Auditors) without requiring a platform login.

## 3. Database Schema Overview

The Drizzle ORM schema (`lib/db/schema.ts`) includes the following core tables:
- **`user` / `account` / `session`**: Managed by `better-auth`.
- **`course`**: Stores course metadata, category, and pricing.
- **`module` & `lesson`**: Hierarchical content structure.
- **`quiz` & `quizQuestion`**: Assessment engine.
- **`enrollment`**: Tracks learner progress (Not Started, In Progress, Completed).

## 4. Environment Configuration

Critical environment variables required for the platform to function:
```env
# Database Connection
DATABASE_URL="postgres://..."

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Sync Engine
SYNC_SECRET="eib-secret-sync-2026"
CLOUD_API_URL="https://your-cloud-domain.com"

# Password Management
DEFAULT_RESET_PASSWORD="ChangeMeImmediately123!"
```

## 5. Next Steps / Ongoing Work
- **CI/CD Automation**: Configuring a GitHub Action or Webhook on the on-premise VM for auto-deploy on `main` push.
