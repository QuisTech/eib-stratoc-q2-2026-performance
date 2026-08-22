# EIB Stratoc Q2 2026 Performance - Project Documentation

This document serves as the comprehensive, up-to-date record of the architecture, features, and technical decisions for the **EIB Stratoc Q2 2026 Performance** (LMS) platform.

## 1. Core Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS & shadcn/ui components
- **Authentication**: Firebase Authentication (Client SDK) with server-side Firebase Admin session cookies (`adminAuth.createSessionCookie` / `adminAuth.verifySessionCookie`) and Role-Based Access Control (RBAC).
- **Database & Structured LMS Data**: Google Cloud Firestore (`firebase-admin/firestore`) for real-time state (users, enrollments, lesson progress, quiz attempts, and certificates).
- **Hybrid Static Catalog Layer**: High-speed, pre-compiled course catalog (`lib/static-lms-courses.ts`) backed by an in-memory TTL caching and request deduplication layer (`lib/firebase-admin.ts`) to prevent Firestore quota exhaustion.
- **Deployment**: 
  - **Cloud**: Vercel (for internet-facing access)
  - **On-Premise / VM Ready**: Designed to run on an internal network via `npm run start` and PM2 standalone bundles.

## 2. Key Features Implemented

### A. Role-Based Access Control (RBAC) & Visibility
The platform supports strict hierarchical access levels to silo data appropriately:
- **Learner (`learner`)**: Can enroll in courses, view modules, take quizzes, and track personal progress via their own portal.
- **Subsidiary Manager (`lead`)**: Elevated privileges. Has access to the Team Admin dashboard to view staff belonging to their specific subsidiary and courses they authored.
- **Group Head (`group_head` & `group_head_standard`)**: Strategic oversight. Has access to the Team Admin dashboard for enrollment and progress metrics across authored strategic courses.
- **Super Admin (`admin`)**: Full, unrestricted global access. Can view all users across all subsidiaries, manage roles, and monitor Firestore quotas.

### B. Custom Course Builder & Interactive Quizzes
- **Offline-First / Fast Static Caching**: Deterministic course catalog generated and synced to static TypeScript modules for zero-latency page loads.
- **Rich Content Attachments & Media**: Supports embedded video URLs, local thumbnails, structured lessons, and interactive knowledge checks.
- **Knowledge Assessment**: Comprehensive quiz evaluation with automated grading and pass/fail thresholds.

### C. User & Session Management
- **Secure Session Cookies**: 7-day HTTP-only session cookies verified on the server side via Firebase Admin.
- **Self-Service**: Logged-in users can update their profile and settings from `/lms/settings`.
- **Admin Utilities**: Super Admins can manage users, update custom claims, and adjust roles directly from the Admin Portal.

### D. Hybrid Sync Engine (Firestore ↔ Static Catalog & Deployment)
- **Live Sync & Deploy**: An authenticated `/api/admin/sync` endpoint that pulls latest courses from Firestore, regenerates the static catalog, and triggers deployment updates.
- **Quota Safeguards**: Firestore query deduplication, batch caching, and quota fallback mechanisms ensure uninterrupted user experience even during high load.

### E. Analytics & Certificate Issuance
- **Certificate Generation**: Automated issuance of unique serial-numbered certificates upon 100% course and quiz completion.
- **Reporting & Exports**: Admin tools for tracking team completion rates and exporting training metrics.

## 3. Data Collections Overview (Cloud Firestore)

- **`users`**: User profiles, roles, assigned subsidiary, and timestamps.
- **`courses`**: Course metadata, category, pricing, duration, modules, lessons, and quiz definitions.
- **`enrollments`**: User course enrollment records and overall progress percentages.
- **`lessonProgress`**: Granular tracking of completed lessons per user per course.
- **`quizAttempts`**: Submitted quiz answers, scores, and pass statuses.
- **`certificates`**: Issued completion certificates with unique serial keys.

## 4. Environment Configuration

Critical environment variables required for the platform to function:
```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin SDK
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# LMS Configuration
LMS_ALLOW_FIRESTORE_COURSE_FALLBACK="true"
```
