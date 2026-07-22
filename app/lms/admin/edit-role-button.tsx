"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { adminUpdateUserRole } from "@/app/actions/lms"
import { ShieldAlert } from "lucide-react"

const VALID_ROLES = ["learner", "lead", "group_head", "group_head_standard", "admin"]

export function EditRoleButton({ userId, userName, currentRole }: { userId: string; userName: string; currentRole: string }) {
  const [loading, setLoading] = useState(false)

  async function handleEdit() {
    const newRole = window.prompt(`Change role for ${userName}.\n\nCurrent Role: ${currentRole}\n\nType one of the following exactly:\nlearner\nlead\ngroup_head\ngroup_head_standard\nadmin`, currentRole)
    if (!newRole || newRole.trim() === "" || newRole.trim() === currentRole) return

    const roleToSave = newRole.trim().toLowerCase()
    
    if (!VALID_ROLES.includes(roleToSave)) {
      alert(`Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`)
      return
    }

    try {
      setLoading(true)
      await adminUpdateUserRole(userId, roleToSave)
    } catch (e: any) {
      alert("Failed to edit role: " + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleEdit} disabled={loading} className="text-muted-foreground hover:text-foreground hover:bg-muted ml-2">
      <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
      {loading ? "Saving..." : "Role"}
    </Button>
  )
}
