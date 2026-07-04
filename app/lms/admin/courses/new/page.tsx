"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCourse } from "@/app/actions/lms"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await createCourse({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        level: formData.get("level") as string,
        format: formData.get("format") as string,
        durationHours: parseInt(formData.get("durationHours") as string),
        priceNaira: parseInt(formData.get("priceNaira") as string) || 0,
        subsidiaries: formData.get("subsidiaries") as string,
        videoUrl: (formData.get("videoUrl") as string) || undefined,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
      })
      router.push("/lms/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            The generative engine will automatically synthesize 5 dynamic lessons and a customized quiz based on the course category you select.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-sm font-medium text-destructive">{error}</div>}
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium">Course Title</label>
              <input id="title" name="title" required className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. Advanced Drone Navigation" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea id="description" name="description" required className="rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Briefly describe what this course will teach..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <select id="category" name="category" required className="h-10 rounded-md border border-input bg-background px-3 text-sm">
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

              <div className="flex flex-col gap-1.5">
                <label htmlFor="level" className="text-sm font-medium">Level</label>
                <select id="level" name="level" required className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="format" className="text-sm font-medium">Format</label>
                <select id="format" name="format" required className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="Online">Online</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Blended">Blended</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="durationHours" className="text-sm font-medium">Duration (Hours)</label>
                <input id="durationHours" name="durationHours" type="number" required defaultValue="8" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="priceNaira" className="text-sm font-medium">Price (₦)</label>
                <input id="priceNaira" name="priceNaira" type="number" required defaultValue="0" className="h-10 rounded-md border border-input bg-background px-3 text-sm" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subsidiaries" className="text-sm font-medium">Target Subsidiaries</label>
                <input id="subsidiaries" name="subsidiaries" required className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. Briech UAS, DCI - SAC" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="videoUrl" className="text-sm font-medium">Video Embed URL (Optional)</label>
              <input id="videoUrl" name="videoUrl" className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. https://www.youtube.com/embed/..." />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="imageUrl" className="text-sm font-medium">Thumbnail Image URL (Optional)</label>
              <input id="imageUrl" name="imageUrl" className="h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. https://images.unsplash.com/..." />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Course
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
