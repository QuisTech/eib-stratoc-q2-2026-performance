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

### A. Role-Based Access Control (RBAC) & Visibility
The platform supports strict hierarchical access levels to silo data appropriately:
- **Learner (`learner`)**: Can enroll in courses, view modules, take quizzes, and track personal progress via their own portal.
- **Subsidiary Manager (`lead`)**: Elevated privileges. Has access to the Team Admin dashboard but can *only* see staff belonging to their specific subsidiary, as well as anyone enrolled in courses they authored.
- **Group Head (`group_head` & `group_head_standard`)**: Strategic oversight. Has access to the Team Admin dashboard but can *only* see the enrollment and progress metrics for the specific courses they have authored.
- **Super Admin (`admin`)**: Full, unrestricted global access. Can view all users across all subsidiaries, reset any user's password, and delete user accounts.

### B. Custom Course Builder (Offline-First)
- **Static/Programmatic Generation**: Instead of relying on external LLMs that require internet access, the platform includes a deterministic course builder.
- **Rich Content Attachments**: Group Heads can attach URLs and text content to lessons.
- **Schema**: Supports robust relational data models linking `Course` -> `Module` -> `Lesson` -> `Quiz`.

### C. User & Password Management (Admin Utilities)
Designed specifically for the constraints of an on-premise, internal deployment where setting up an SMTP email server is undesirable:
- **Self-Service**: Logged-in users can change their password securely from the `/lms/settings` page.
- **Admin Failsafe Reset**: Super Admins can instantly force-reset a forgotten user's password from the Admin Dashboard to a configurable temporary default. This was implemented natively using `better-auth/crypto` to securely hash the password and update the database directly, bypassing restrictive plugin requirements.
- **Secure User Deletion**: Super Admins have the ability to permanently delete test accounts or separated staff. This triggers a cascading deletion, ensuring all related data (enrollments, lesson progress, quiz attempts, and certificates) are safely purged without leaving dangling references in the database.

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

## 6. Recent Challenges and Resolutions (July 2026)

During the finalization of the on-premise deployment, several edge-case challenges were resolved:

1. **422 - Failed to Create User (Better Auth Admin Plugin)**
   - *Issue*: The official `better-auth` `admin()` plugin caused silent 422 errors during user registration and password resets due to strict internal schemas and SMTP dependencies.
   - *Resolution*: Stripped out the `admin()` plugin entirely. Replaced it with a native, robust Admin Dashboard UI using manual `better-auth/crypto` for password hashing, enabling offline, internal-only password resets without an SMTP server.

2. **Multi-Domain CSRF Blocks (Failed to get session)**
   - *Issue*: Better Auth rejected session requests (returning 500 APIErrors) when the app was accessed via the on-premise domain (`https://lms.eibstratoc.com`) because `BETTER_AUTH_URL` was strictly set to the Vercel cloud domain.
   - *Resolution*: Replaced the rigid `baseURL` configuration in `lib/auth.ts` with a `trustedOrigins` array, explicitly whitelisting all internal IPs, Vercel domains, and on-premise domains to bypass CSRF blocks gracefully. Added `try/catch` boundaries to gracefully log out users instead of crashing the server if network fetches fail.

3. **On-Premise Schema Mismatches & PM2 Caching**
   - *Issue*: The on-premise server crashed with `column "videoUrl" does not exist` after a `git pull`, despite the cloud database working perfectly. This occurred because `.env.production` is `.gitignore`'d (preventing connection string updates) and PM2 permanently cached an old offline database URL.
   - *Resolution*: Overwrote the local `.env.production` file on the VM to perfectly match the Neon cloud database, removed `channel_binding=require` to ensure compatibility with the VM's older Node/pg driver, and executed a hard process reset (`pm2 delete eib-lms-production && pm2 start ecosystem.config.js --env production`) to flush PM2's memory.
