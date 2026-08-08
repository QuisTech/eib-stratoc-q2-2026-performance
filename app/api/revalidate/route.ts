import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    revalidatePath("/", "layout")
    revalidatePath("/lms", "layout")
    revalidatePath("/lms/[slug]", "page")
    revalidatePath("/lms/[slug]/learn/[lesson]", "page")
    // @ts-ignore
    revalidateTag("lms-courses")
    // @ts-ignore
    revalidateTag("lms-course-by-slug-v1")
    // @ts-ignore
    revalidateTag("lms-course-by-id-v1")
    // @ts-ignore
    revalidateTag("lms-admin-source-v1")
  } catch (e) {}

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

