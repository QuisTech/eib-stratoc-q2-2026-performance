import { getSessionUser } from "@/app/actions/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { isSuperAdminEmail } from "@/lib/access-control"

import { updateCourse } from "@/app/actions/lms"
import { ImageUploadField } from "@/components/lms/image-upload-field"




export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getSessionUser();
  const session = user ? { user } : null
  if (!session?.user) redirect("/sign-in")

  const role = session.user.role as string
  const isSuperAdmin = isSuperAdminEmail(session.user.email)
  if (!isSuperAdmin && role !== "group_head" && role !== "lead") redirect("/lms")

  const { getAdminCourseBySlug } = await import("@/app/actions/lms")
  const course = await getAdminCourseBySlug(slug)
  if (!course) redirect("/lms/admin")
  if (!isSuperAdmin && course.authorId !== session.user.id) redirect("/lms/admin")

  async function handleUpdate(formData: FormData) {
    "use server"
    await updateCourse(slug, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      level: formData.get("level") as string,
      format: formData.get("format") as string,
      durationHours: parseInt(formData.get("durationHours") as string),
      priceNaira: parseInt(formData.get("priceNaira") as string) || 0,
      subsidiaries: formData.get("subsidiaries") as string,
      videoUrl: (formData.get("videoUrl") as string) || null,
      imageUrl: (formData.get("imageUrl") as string) || null,
      isBriefing: formData.get("isBriefing") === "on",
    })
    redirect("/lms/admin")
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-10">
      <Link
        href="/lms/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-8 border-b pb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
          Edit Metadata: {course.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the metadata for this course. If you change the Title or Category, the Generative Engine will automatically regenerate the lesson text and quiz questions to match!
        </p>
      </div>

      <form action={handleUpdate} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Course Title</label>
            <input id="title" name="title" required defaultValue={course.title} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <select id="category" name="category" required defaultValue={course.category} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="Technical">Technical</option>
              <option value="Reporting & Documentation">Reporting & Documentation</option>
              <option value="Operational">Operational</option>
              <option value="Emerging Tech">Emerging Tech</option>
              <option value="Safety & Compliance">Safety & Compliance</option>
              <option value="Customer-Facing">Customer-Facing</option>
              <option value="Project Management">Project Management</option>
              <option value="M&E / Data">M&E / Data</option>
              <option value="Financial">Financial</option>
              <option value="Leadership">Leadership</option>
              <option value="Media & Content">Media & Content</option>
              <option value="Digital Media">Digital Media</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Intelligence & Security">Intelligence & Security</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium">Description</label>
          <textarea id="description" name="description" required defaultValue={course.description} rows={3} className="rounded-md border border-input bg-background p-3 text-sm" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="level" className="text-sm font-medium">Level</label>
            <select id="level" name="level" required defaultValue={course.level} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="format" className="text-sm font-medium">Format</label>
            <select id="format" name="format" required defaultValue={course.format} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="Online">Online</option>
              <option value="Blended">Blended</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="durationHours" className="text-sm font-medium">Duration (Hours)</label>
            <input id="durationHours" name="durationHours" type="number" required defaultValue={course.durationHours} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="priceNaira" className="text-sm font-medium">Price (₦)</label>
            <input id="priceNaira" name="priceNaira" type="number" required defaultValue={course.priceNaira} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="subsidiaries" className="text-sm font-medium">Target Subsidiaries</label>
            <input id="subsidiaries" name="subsidiaries" required defaultValue={course.subsidiaries || ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" id="isBriefing" name="isBriefing" defaultChecked={course.isBriefing ?? false} className="h-4 w-4 rounded border-input" />
          <label htmlFor="isBriefing" className="text-sm font-medium">Mark as Strategic Briefing (Hides from LMS Course Catalog)</label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="videoUrl" className="text-sm font-medium">Video Embed URL (Optional)</label>
          <input id="videoUrl" name="videoUrl" defaultValue={course.videoUrl || ""} className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. https://www.youtube.com/embed/..." />
        </div>

        <ImageUploadField name="imageUrl" defaultValue={course.imageUrl || ""} label="Thumbnail Image URL (Optional)" />

        <button
          type="submit"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Save Changes
        </button>
      </form>
    </main>
  )
}
