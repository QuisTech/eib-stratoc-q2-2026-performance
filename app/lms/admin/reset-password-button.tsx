"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminResetUserPassword } from "@/app/actions/lms"
import { Loader2, KeyRound } from "lucide-react"

export function ResetPasswordButton({ userId, userName }: { userId: string; userName: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleReset() {
    if (!confirm(`Are you sure you want to reset the password for ${userName}? The new password will be EIB2026!`)) {
      return
    }
    
    setLoading(true)
    try {
      await adminResetUserPassword(userId)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (e) {
      alert("Failed to reset password. You might not have permission.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReset} 
      disabled={loading || done}
      className={done ? "text-emerald-500 border-emerald-500" : ""}
    >
      {loading ? (
        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
      ) : (
        <KeyRound className="mr-2 h-3.5 w-3.5" />
      )}
      {done ? "Reset to EIB2026!" : "Reset Password"}
    </Button>
  )
}
