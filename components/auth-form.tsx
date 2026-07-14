"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"
import { autoEnrollOnboarding } from "@/app/actions/lms"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createSessionCookie, createUserProfile } from "@/app/actions/auth"

const SUBSIDIARY_GROUPS = {
  "Group Leadership": [
    "EIB Group",
    "Directorate of Clandestine & Intelligence"
  ],
  "Directorate of Clandestine & Intelligence (DCI)": [
    "DCI - SAC",
    "DCI - PSAP",
    "DCI - RAW",
    "DCI - Intel"
  ],
  "Commercial & Operational": [
    "EIB Stratoc",
    "Luftreiber Automobile",
    "POCTOVA",
    "Briech Atlantic",
    "Briech UAS",
    "Luft PayTV",
    "Bright FM",
    "BEF",
    "Giga Forensics"
  ]
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [subsidiary, setSubsidiary] = useState("EIB Stratoc")
  const [role, setRole] = useState<"learner" | "lead" | "group_head_standard" | "group_head">("learner")
  const [accessCode, setAccessCode] = useState("")
  const [resetSent, setResetSent] = useState(false)

  function handleRoleChange(next: "learner" | "lead" | "group_head_standard" | "group_head") {
    setRole(next)
    if (next === "group_head" || next === "group_head_standard") setSubsidiary("EIB Group")
  }
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResetSent(false)
    setLoading(true)

    try {
      if (isSignUp) {
        if (role === "group_head" && email.toLowerCase().trim() !== "michael.marquis@eibgroup.com") {
          throw new Error("LMS Admin oversight is restricted. Only the Group Head of Training & OD may register with this role.")
        }
        if (role === "group_head" && accessCode.trim().toUpperCase() !== "EIB-GH-2026") {
          throw new Error("Invalid Group Head access code.")
        }
        if (role === "group_head_standard") {
          if (subsidiary === "Directorate of Clandestine & Intelligence" && accessCode.trim().toUpperCase() !== "DCI-GH-2026") {
            throw new Error("Invalid DCI Directorate Head access code.")
          }
          if (subsidiary === "EIB Group" && accessCode.trim().toUpperCase() !== "EIB-GH-2026") {
            throw new Error("Invalid Group Head access code.")
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const finalRole = role === "group_head_standard" ? "lead" : role;
        await createUserProfile(user.uid, {
          name,
          email,
          role: finalRole,
          subsidiary,
        })

        const idToken = await user.getIdToken()
        await createSessionCookie(idToken)

        try {
          await autoEnrollOnboarding(subsidiary)
        } catch (e) {
          console.error("Auto enroll onboarding failed:", e)
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await userCredential.user.getIdToken()
        await createSessionCookie(idToken)
      }
      window.location.href = "/lms"
    } catch (err: any) {
      if (err.code === "auth/invalid-password-hash" || (err.message && err.message.includes("auth/invalid-password-hash"))) {
        try {
          await sendPasswordResetEmail(auth, email)
          setResetSent(true)
        } catch (resetErr) {
          setError("Failed to send the security update link. Please contact IT.")
        }
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.")
      } else if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.")
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
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
                {Object.entries(SUBSIDIARY_GROUPS).map(([groupName, subs]) => (
                  <optgroup key={groupName} label={groupName}>
                    {subs.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
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
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              >
                <option value="learner">Learner — enroll and study</option>
                <option value="lead">Subsidiary Managers — also track my team</option>
                <option value="group_head_standard">Group Heads</option>
                <option value="group_head">Group Head (Training & OD)</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {role === "group_head"
                  ? "Exclusive to the Group Head of Training & OD."
                  : role === "group_head_standard"
                    ? "Group Heads oversee their respective departments within the parent company."
                  : role === "lead"
                    ? "Managers can view enrollment and completion across their own subsidiary."
                    : "Learners enroll in courses and track their own progress."}
              </p>
            </div>
          )}

          {isSignUp && (role === "group_head" || role === "group_head_standard") && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="accessCode" className="text-sm font-medium text-destructive">
                {subsidiary === "Directorate of Clandestine & Intelligence" ? "DCI Head Access Code" : "Group Head Access Code"}
              </label>
              <input
                id="accessCode"
                type="text"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
                placeholder="Required for leadership roles"
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

          {resetSent && (
            <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
              <p className="font-semibold mb-1">Security Upgrade Notice</p>
              <p>We have recently upgraded our platform's security infrastructure! For your protection, we have just emailed you a secure link. Please click it to quickly update your password and continue to your dashboard.</p>
              <p className="mt-2 font-medium">If you are using an internal email without an inbox, please sign in using the temporary password: <strong>Welcome2026!</strong></p>
            </div>
          )}

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
