import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const targetEmail = "michael.marquis@eibgroup.com"
    await db.update(user).set({ role: "admin" }).where(eq(user.email, targetEmail))
    return NextResponse.json({ success: true, message: `Promoted ${targetEmail} to admin` })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
