import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  database: pool,
  baseURL: {
    allowedHosts: [
      "eib-stratoc-q2-2026-performance.vercel.app",
      "eib-stratoc-q2-2026-performance-theta.vercel.app",
    ],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    fallback: "https://eib-stratoc-q2-2026-performance.vercel.app"
  },
  advanced: {
    trustedProxyHeaders: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "learner",
        // Accepted from sign-up; the form only offers "learner" or "lead".
        // Full cross-subsidiary "admin" is granted in the database, never self-served.
        input: true,
      },
      subsidiary: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  trustedOrigins: [
    "https://eib-stratoc-q2-2026-performance.vercel.app",
    "https://eib-stratoc-q2-2026-performance-theta.vercel.app",
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.NODE_ENV === "development"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: "none" as const,
            secure: true,
          },
        },
      }
    : {}),
})
