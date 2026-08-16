import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminFeedbackView } from "@/components/lms/admin-feedback-view"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL("https://lms.eibstratoc.com"),
  title: "Staff Feedback & Course Improvement Hub | EIB Group LMS",
  description:
    "Real-time feedback collected from staff across EIB Group subsidiaries on courses and lessons.",
  icons: {
    icon: [
      { url: "https://lms.eibstratoc.com/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://lms.eibstratoc.com/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://lms.eibstratoc.com/favicon.png", type: "image/png" },
      { url: "https://lms.eibstratoc.com/eiblogo.png", type: "image/png" },
      { url: "https://lms.eibstratoc.com/favicon.ico" },
    ],
    shortcut: "https://lms.eibstratoc.com/favicon-32x32.png",
    apple: [
      { url: "https://lms.eibstratoc.com/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Staff Feedback & Course Improvement Hub | EIB Group LMS",
    description:
      "Real-time feedback collected from staff across EIB Group subsidiaries on courses and lessons.",
    url: "https://lms.eibstratoc.com/lms/admin/feedback",
    siteName: "EIB Group LMS",
    type: "website",
    images: [
      {
        url: "https://lms.eibstratoc.com/opengraph-image.jpg",
        secureUrl: "https://lms.eibstratoc.com/opengraph-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Staff Feedback & Course Improvement Hub | EIB Group LMS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Staff Feedback & Course Improvement Hub | EIB Group LMS",
    description:
      "Real-time feedback collected from staff across EIB Group subsidiaries on courses and lessons.",
    images: ["https://lms.eibstratoc.com/opengraph-image.jpg"],
  },
}

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
