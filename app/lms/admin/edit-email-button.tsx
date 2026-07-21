"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminUpdateUserEmail } from "@/app/actions/lms"
import { Mail } from "lucide-react"

export function EditEmailButton({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [loading, setLoading] = useState(false)

  async function handleEdit() {
    const newEmail = window.prompt(`Enter new email for ${userEmail}:`, userEmail)
    if (!newEmail || newEmail.trim() === "" || newEmail.trim() === userEmail) return

    try {
      setLoading(true)
      await adminUpdateUserEmail(userId, newEmail)
    } catch (e: any) {
      alert("Failed to edit email: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleEdit} disabled={loading} className="text-muted-foreground hover:text-foreground hover:bg-muted ml-2">
      <Mail className="w-3.5 h-3.5 mr-1.5" />
      {loading ? "Saving..." : "Edit Email"}
    </Button>
  )
}
