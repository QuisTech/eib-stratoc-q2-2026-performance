"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminDeleteUser } from "@/app/actions/lms"
import { Trash2 } from "lucide-react"

export function DeleteUserButton({ userId, userName }: { userId: string; userName: string }) {
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    if (!confirm(`Are you absolutely sure you want to permanently delete the user ${userName}? This will erase all of their enrollments, progress, and certificates. This action cannot be undone.`)) return

    try {
      setLoading(true)
      await adminDeleteUser(userId)
      alert(`User ${userName} has been deleted.`)
    } catch (e: any) {
      alert("Failed to delete user: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleReset} disabled={loading} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 ml-2">
      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
      {loading ? "Deleting..." : "Delete"}
    </Button>
  )
}
