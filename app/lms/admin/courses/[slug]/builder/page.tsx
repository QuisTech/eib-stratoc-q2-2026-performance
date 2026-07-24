import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { getCourseBySlug, getAdminCourseBySlug } from "@/app/actions/lms"
import CourseBuilderClient from "./client"

export const maxDuration = 60;

export default async function CourseBuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getSessionUser();
  const session = user ? { user } : null
  if (!session?.user) redirect("/sign-in")

  const role = session.user.role as string
  const isSuperAdmin = checkIsSuperAdmin(session.user)
  if (!isSuperAdmin && role !== "group_head" && role !== "lead") redirect("/lms")

  const course = await getAdminCourseBySlug(slug)
  if (!course) redirect("/lms/admin")
  if (!isSuperAdmin && course.authorId !== session.user.id) redirect("/lms/admin")

  return <CourseBuilderClient course={course} userRole={isSuperAdmin ? "admin" : role} />
}
