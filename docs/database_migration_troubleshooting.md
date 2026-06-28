# Post-Mortem: Vercel, Neon Postgres, & Better Auth Migration Failures

## The Problem: "Relation does not exist"

When deploying the EIB Group Learning Management System (LMS) to Vercel, the application consistently crashed with `500 Internal Server Error` during the sign-up process, and subsequently on the `/lms` dashboard.

The underlying error in the Vercel logs was `error: relation "user" does not exist`, which eventually progressed to `relation "courses" does not exist`. 

### The Root Cause

The issue stemmed from a combination of Vercel's build environment, Neon Postgres integration, and how Drizzle ORM handles migrations:

1. **Build-Time Database Isolation**: The `package.json` included a build step intended to push the database schema: `"build": "drizzle-kit push && next build"`. However, Vercel tightly controls environment variables during the build phase for security. The `POSTGRES_URL` connection string provided by the Neon integration was either not fully accessible during the build, or the build cache bypassed the command entirely.
2. **Silent Failures**: Because `drizzle-kit push` did not explicitly throw a fatal error that halted the build process when it couldn't connect to the database, Vercel assumed the deployment succeeded.
3. **Better Auth & Empty Databases**: Better Auth expects its underlying tables (`user`, `session`, `account`, `verification`) to already exist when it attempts to write user data. Because the schema push failed silently, the tables were never created in production, leading to fatal crashes when queries were executed at runtime.

## The Solution: Runtime Database Initialization

To completely bypass the unreliable build-step migration process, we implemented a self-healing **runtime initialization strategy**. 

Instead of relying on `drizzle-kit push` during deployment, we created an explicit, authenticated (or hidden) API endpoint (`/api/db/setup`) that executes raw SQL `CREATE TABLE IF NOT EXISTS` commands directly against the Neon database using the `pg` pool.

### Key Implementation Details

1. **Direct SQL Execution**: We bypassed `drizzle-kit` and wrote direct `CREATE TABLE` queries for the entire schema (Auth tables and LMS application tables).
2. **Auto-Seeding**: Because the LMS relies on curated courses mapped to a Skill-Gap Analysis, we included an `INSERT INTO` block that dynamically generates and seeds exactly 17 carefully curated courses into the database if the `courses` table is found to be empty.
3. **Execution Context**: By running this inside an API route (`/api/db/setup`), the code executes in Vercel's Serverless environment at *runtime*, where the `POSTGRES_URL` is fully populated and authorized to communicate with Neon.

> [!TIP]
> **Best Practice for Next.js + Neon + Vercel**
> While `drizzle-kit push` works beautifully in local development, relying on it inside Vercel's build script can be brittle. A safer approach for small to medium projects is to use an explicit database seeding/migration script that is executed via a separate secure endpoint or GitHub Action after the deployment is live.

## Summary of the Fixes
- Added comprehensive raw SQL table creation to `/api/db/setup`.
- Added dynamic course seeding derived from `lib/plan-data.ts`.
- Removed `baseURL` from Better Auth config to allow dynamic Vercel preview domain inference.
- Added stack-trace logging to the global auth catch-all route to capture swallowed 500 errors.
