import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

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
  trustedOrigins: [
    "https://lms-eibgroup.vercel.app",
    "https://lms.eibgroup.vercel.app",
    "https://lms.eibstratoc.com",
    "http://lms.eibstratoc.com",
    "http://41.242.54.72",
    "https://41.242.54.72",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  advanced: {
    trustedProxyHeaders: true,
    defaultCookieAttributes: {
      sameSite: "lax" as const,
      secure: false,
      httpOnly: true,
      path: "/",
    },
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
        input: false,
      },
      subsidiary: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

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
