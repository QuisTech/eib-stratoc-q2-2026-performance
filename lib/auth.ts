import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  baseURL: {
    allowedHosts: [
      "lms-eibgroup.vercel.app",
      "lms.eibgroup.vercel.app",
      "lms.eibstratoc.com",
      "41.242.54.72",
    ],
    protocol: "http",
    fallback: "http://lms.eibstratoc.com"
  },
  advanced: {
    trustedProxyHeaders: true,
    defaultCookieAttributes: {
      sameSite: "lax" as const,
      secure: false,
      httpOnly: true,
      path: "/",
    },
  },
  plugins: [
    admin({
      defaultRole: "learner",
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      subsidiary: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  trustedOrigins: [
    "https://lms-eibgroup.vercel.app",
    "https://lms.eibgroup.vercel.app",
    "http://lms.eibstratoc.com",
    "https://lms.eibstratoc.com",
    "http://41.242.54.72",
    "https://41.242.54.72",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  cookies: {
    session: {
      name: "better-auth.session",
      sameSite: "lax",
      secure: false,
      path: "/",
      httpOnly: true,
    },
  },
})
