"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminUpdateUserName } from "@/app/actions/lms"
import { Edit } from "lucide-react"

export function EditNameButton({ userId, userName }: { userId: string; userName: string }) {
  const [loading, setLoading] = useState(false)

  async function handleEdit() {
    const newName = window.prompt(`Enter new name for ${userName}:`, userName)
    if (!newName || newName.trim() === "" || newName.trim() === userName) return

    try {
      setLoading(true)
      await adminUpdateUserName(userId, newName)
    } catch (e: any) {
      alert("Failed to edit name: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleEdit} disabled={loading} className="text-muted-foreground hover:text-foreground hover:bg-muted ml-2">
      <Edit className="w-3.5 h-3.5 mr-1.5" />
      {loading ? "Saving..." : "Edit"}
    </Button>
  )
}
