import { getSessionUser } from "@/app/actions/auth"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Sign In | EIB Group LMS",
  description: "Sign in to the EIB Group Learning Management System.",
}

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <AuthForm mode="sign-in" />
    </main>
  )
}
