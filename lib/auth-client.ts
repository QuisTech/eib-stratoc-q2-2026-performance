"use client"

import { useState, useEffect } from "react"
import { getSessionUser, clearSessionCookie } from "@/app/actions/auth"
import { auth } from "@/lib/firebase"

export function useSession() {
  const [session, setSession] = useState<{ user: any } | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      try {
        const user = await getSessionUser()
        if (user) {
          setSession({ user })
        } else {
          setSession(null)
        }
      } catch (e) {
        setSession(null)
      } finally {
        setIsPending(false)
      }
    }
    fetchSession()
  }, [])

  return { data: session, isPending }
}

export const signOut = async () => {
  await auth.signOut()
  await clearSessionCookie()
  window.location.href = "/sign-in"
}
