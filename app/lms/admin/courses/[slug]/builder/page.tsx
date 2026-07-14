import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"




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
  if (role !== "admin" && role !== "group_head" && role !== "lead") redirect("/lms")

  const { getCourseBySlug } = await import("@/app/actions/lms")
  const course = await getCourseBySlug(slug)
  if (!course) redirect("/lms/admin")
  if (role !== "admin" && course.authorId !== session.user.id) redirect("/lms/admin")

  return <CourseBuilderClient course={course} userRole={role} />
}
