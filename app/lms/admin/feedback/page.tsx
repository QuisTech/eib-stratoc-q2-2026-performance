import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminFeedbackView } from "@/components/lms/admin-feedback-view"

export const dynamic = "force-dynamic"

export default async function AdminFeedbackPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/lms/admin"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Admin Hub
        </Link>
      </div>

      <AdminFeedbackView />
    </main>
  )
}
