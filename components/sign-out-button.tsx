"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { signOut as authSignOut } from "@/lib/auth-client"
import { LogOut, Loader2 } from "lucide-react"

export function SignOutButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function signOut() {
    startTransition(async () => {
      await authSignOut()
      router.push("/sign-in")
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className={className}
      aria-label="Sign out"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      Sign out
    </button>
  )
}
