import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courses } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import CourseBuilderClient from "./client"

export default async function CourseBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const role = session.user.role as string
  if (role !== "admin" && role !== "group_head") redirect("/lms")

  const [course] = await db.select().from(courses).where(eq(courses.slug, slug))
  if (!course) redirect("/lms/admin")

  return <CourseBuilderClient course={course} />
}
