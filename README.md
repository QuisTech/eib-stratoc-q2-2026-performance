# EIB Stratoc Q2 2026 Performance (LMS Platform)

A Next.js enterprise Learning Management System (LMS) engineered for **EIB Group** subsidiaries, delivering role-based staff training, AI-assisted curriculum authoring, automated quiz grading, verifiable certificate generation, and Firestore quota protection architecture.

---

## 1. Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS & shadcn/ui components
- **Authentication**: Firebase Authentication (Client SDK) with server-side Firebase Admin session cookies (`adminAuth.createSessionCookie` / `adminAuth.verifySessionCookie`) and Role-Based Access Control (RBAC).
- **Database & Live State**: Google Cloud Firestore (`firebase-admin/firestore`) for real-time state (`users`, `enrollments`, `lessonProgress`, `quizAttempts`, `certificates`, `lms_feedback`).
- **Hybrid Static Catalog Layer**: High-speed, pre-compiled course catalog (`lib/static-lms-courses.ts`) backed by an in-memory TTL cache and query deduplication layer (`lib/firebase-admin.ts`) to operate seamlessly within Cloud Firestore free limits.
- **AI Curriculum Engine**: Integrated Groq AI SDK (`openai/gpt-oss-120b`, `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) with automatic multi-key rotation and multi-tier fallbacks.

---

## 2. Key Features

- **Role-Based Access Control (RBAC)**: Strict separation of privileges across `learner`, `lead` (Subsidiary Manager), `group_head` / `group_head_standard` (Strategic Division Heads), and `admin` (Super Admin).
- **Interactive Course & Quiz Builder**: Custom lesson designer with multi-tab case studies, matching knowledge checks, AI takeaway generation, and distractor-balanced multiple-choice quizzes.
- **Automated Grading & Progress Tracking**: Strict-equality evaluation, legacy index parsing (A/B/C/D letter support), and milestone completion tracking.
- **Certificate Issuance Engine**: Deterministic serial number generation (`EIB-XXX-XXXXXX`) upon 100% course and quiz completion with printable verification views.
- **Hybrid Cloud Sync**: On-demand `/api/admin/sync` route that pulls Firestore updates, regenerates the static TypeScript course catalog, pushes commits to GitHub via API token, and restarts PM2 in on-premise environments.

---

## 3. Quota Management & Architectural Troubleshooting

### The Problem: Early Quota Exhaustion
On high-activity days, Google Cloud Firestore daily free read quotas (~50,000 document reads/day, resetting at 07:00 UTC) were being exhausted rapidly during active administration and course creation sessions.

### Root Causes Identified:
1. **Coupled Cache Invalidation**: Saving course lessons or quiz definitions in `saveCustomCourseContent` previously triggered `revalidateCacheTag(ADMIN_SOURCE_CACHE_TAG)`, which forced a complete re-read of the admin source caches.
2. **Full Collection Document Scans**: When `ADMIN_SOURCE_CACHE_TAG` was invalidated, any load of the admin dashboard or reporting executed `getAllUsers()`, `getAllEnrollments()`, and `getAllCertificates()`, fetching entire Firestore collections.
3. **Uncached Admin Course Queries**: `getAdminCourses()` bypassed in-memory caching on `force-dynamic` admin pages, hitting Firestore on every page refresh.
4. **Cold Starts on Server Restarts**: In-memory caching was cleared during server restarts/builds, leading to a cache stampede if multiple requests arrived concurrently.

### Solutions & Safeguards Implemented:
- **Decoupled Course Edits from Learner Analytics**: Course creations, updates, soft-deletes, and custom content saves only invalidate `COURSE_CACHE_TAG` and specific course route paths. Admin reporting collections (`users`, `enrollments`, `certificates`) remain untouched and cached.
- **Unified In-Memory Caching for Admin Views**: `getAdminCourses()` and `getCourses()` share the in-memory `courses` and `admin_courses` TTL cache, serving admin catalog views instantly without database reads.
- **Atomic, Race-Condition-Safe Operations**: Cache deletions are synchronous in the Node.js event loop, and all concurrent identical queries are deduplicated via in-flight Promise multiplexing (`deduplicatedQuery` in `lib/firebase-admin.ts`).
- **Quota-Safe Admin Default View**: The admin dashboard defaults to a lightweight view, requiring explicit user interaction (`?full=1`) before loading group-wide learner tables.

---

## 4. Getting Started & Development

### Prerequisites
- Node.js 20+ (Node 24 recommended)
- pnpm / npm

### Local Setup
```bash
# Clone the repository
git clone https://github.com/QuisTech/eib-stratoc-q2-2026-performance.git
cd eib-stratoc-q2-2026-performance

# Install dependencies
pnpm install # or npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev # or npm run dev
```

---

## 5. Production Deployment (VPS / On-Premise)

To pull the latest changes, build, and restart the production server under PM2:

```bash
cd /home/apps/my-lms && git checkout -- . && git pull origin main && npm run build && pm2 restart eib-lms-production
```

---

## 6. Environment Configuration

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="eib-lms"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Firebase Admin SDK
FIREBASE_PROJECT_ID="eib-lms"
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# Groq AI Keys (Comma-separated for automated rotation)
GROQ_API_KEY="gsk_key1,gsk_key2,gsk_key3"

# GitHub Integration (for Hybrid Sync)
GITHUB_TOKEN="ghp_..."
GITHUB_REPO="QuisTech/eib-stratoc-q2-2026-performance"
```
