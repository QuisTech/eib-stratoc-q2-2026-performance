import { getSessionUser } from "@/app/actions/auth"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Sign In | EIB Group LMS",
  description: "Sign in to the EIB Group Learning Management System.",
}

export default async function SignInPage() {
  try {
    const user = await getSessionUser();
    const session = user ? { user } : null
    if (session?.user) redirect("/lms")

    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <AuthForm mode="sign-in" />
      </main>
    )
  } catch (error: any) {
    return (
      <div className="p-10 font-mono text-red-500">
        <h1 className="text-xl font-bold">Server Crash on Sign In Page:</h1>
        <p className="mt-4">{error?.message || String(error)}</p>
        <pre className="mt-4 text-xs whitespace-pre-wrap">{error?.stack}</pre>
      </div>
    )
  }
}
