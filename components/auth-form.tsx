"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"

const SUBSIDIARIES = [
  "EIB Group", // parent company — Group Heads register here
  "EIB Stratoc",
  "Luftreiber Automobile",
  "POCTOVA",
  "Briech Atlantic",
  "Briech UAS",
  "Bright FM",
  "BEF",
]

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Default learners to the first operating subsidiary, not the parent company.
  const [subsidiary, setSubsidiary] = useState("EIB Stratoc")
  const [role, setRole] = useState<"learner" | "lead" | "group_head">("learner")
  const [accessCode, setAccessCode] = useState("")

  // Group Heads belong to the parent company; keep their subsidiary aligned.
  function handleRoleChange(next: "learner" | "lead" | "group_head") {
    setRole(next)
    if (next === "group_head") setSubsidiary("EIB Group")
  }
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (role === "group_head" && accessCode.trim().toUpperCase() !== "EIB-GH-2026") {
          throw new Error("Invalid Group Head access code. Please contact the administrator.")
        }

        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          // additional fields configured in lib/auth.ts
          subsidiary,
          role,
        } as Parameters<typeof authClient.signUp.email>[0])
        if (error) throw new Error(error.message ?? "Could not create account")
      } else {
        const { error } = await authClient.signIn.email({ email, password })
        if (error) throw new Error(error.message ?? "Invalid email or password")
      }
      router.push("/lms")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <CardTitle className="font-heading text-2xl">
          {isSignUp ? "Create your account" : "Sign in to the LMS"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Join the EIB Group learning platform to enroll in training mapped to your role."
            : "Access your assigned courses and track your learning progress."}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
                placeholder="Jane Doe"
              />
            </div>
          )}

          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subsidiary" className="text-sm font-medium">
                Subsidiary
              </label>
              <select
                id="subsidiary"
                value={subsidiary}
                onChange={(e) => setSubsidiary(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              >
                {SUBSIDIARIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isSignUp && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Account type
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as "learner" | "lead" | "group_head")}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              >
                <option value="learner">Learner — enroll and study</option>
                <option value="lead">Subsidiary Lead — also track my team</option>
                <option value="group_head">Group Head — oversight across all subsidiaries</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {role === "group_head"
                  ? "Group Heads see learning across the whole organization — every subsidiary."
                  : role === "lead"
                    ? "Leads can view enrollment and completion across their own subsidiary."
                    : "Learners enroll in courses and track their own progress."}
              </p>
            </div>
          )}

          {isSignUp && role === "group_head" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="accessCode" className="text-sm font-medium text-destructive">
                Group Head Access Code
              </label>
              <input
                id="accessCode"
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
                placeholder="Required for Group Head"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              placeholder="you@eibgroup.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </>
          ) : (
            <>
              Need an account?{" "}
              <Link href="/sign-up" className="font-medium text-primary hover:underline">
                Create one
              </Link>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
