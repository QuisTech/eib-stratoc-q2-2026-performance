import { getSessionUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { isSuperAdmin as checkIsSuperAdmin } from "@/lib/access-control"
import { getAdminCourses } from "@/app/actions/lms"
import { CourseManagement } from "../course-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function CourseManagementPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  const role = user.role ?? "learner"
  const isSuperAdmin = checkIsSuperAdmin(user)
  const canManageCourses = isSuperAdmin || role === "group_head" || role === "lead" || role === "group_head_standard"

  if (!canManageCourses) {
    redirect("/lms")
  }

  // ✅ This ONLY fetches courses - NO user scan!
  const courses = await getAdminCourses()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <Link
        href="/lms/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Admin
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
            Course Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, edit, and manage courses without loading learner data. This view is quota-friendly.
          </p>
        </div>
        <Link
          href="/lms/admin/courses/new"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Course
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseManagement 
            courses={courses} 
            userRole={isSuperAdmin ? "admin" : role}
            userEmail={user.email}
          />
        </CardContent>
      </Card>
    </main>
  )
}
