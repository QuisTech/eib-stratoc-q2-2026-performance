import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function GET() {
  revalidatePath("/lms")
  revalidatePath("/lms/admin")
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
