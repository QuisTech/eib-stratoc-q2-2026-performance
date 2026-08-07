import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    revalidatePath("/", "layout")
    revalidatePath("/lms", "layout")
    revalidatePath("/lms/[slug]", "page")
    revalidatePath("/lms/[slug]/learn/[lesson]", "page")
    revalidateTag("lms-courses")
    revalidateTag("lms-course-by-slug-v1")
    revalidateTag("lms-course-by-id-v1")
    revalidateTag("lms-admin-source-v1")
  } catch (e) {}

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

