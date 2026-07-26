import { getSessionUser } from "@/app/actions/auth"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { getCourseBySlug, getCertificateForCourse } from "@/app/actions/lms"
import { INITIATIVE_NAMES } from "@/lib/lms-content"
import { formatNaira } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { PrintActions } from "@/components/print-actions"
import { ArrowLeft, ShieldCheck, Award } from "lucide-react"

type Params = { slug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  return { title: course ? `Certificate · ${course.title} | EIB Group LMS` : "Certificate" }
}

export default async function CertificatePage({ 
  params,
  searchParams
}: { 
  params: Promise<Params>,
  searchParams: Promise<{ userId?: string }>
}) {
  const { slug } = await params
  const { userId: targetUserId } = await searchParams
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const user = await getSessionUser();
  const session = user ? { user } : null
  
  if (!targetUserId && !session?.user) {
    redirect("/sign-in")
  }

  const certificate = await getCertificateForCourse(course.id, targetUserId)
  if (!certificate) redirect(`/lms/${slug}`)

  let certName = session?.user?.name || session?.user?.email || "Learner"
  let certEmail = session?.user?.email || ""
  if (targetUserId && targetUserId !== session?.user?.id) {
    const { adminDb } = await import("@/lib/firebase-admin")
    const doc = await adminDb.collection("users").doc(targetUserId).get()
    if (doc.exists) {
      const targetUser = doc.data() as { name: string, email: string }
      certName = targetUser.name || targetUser.email || "Learner"
      certEmail = targetUser.email || ""
    }
  }

  const issued = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const initiative =
    course.initiative != null ? INITIATIVE_NAMES[course.initiative] ?? null : null

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/lms/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to course
        </Link>
        <PrintActions label="certificate" />
      </div>

      {/* Certificate */}
      <article className="avoid-break relative overflow-hidden rounded-lg border-2 border-blue-800/30 bg-white p-8 shadow-sm md:p-14 text-slate-900">
        {/* Watermark */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
          style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        >
          <div className="flex flex-col items-center gap-10 text-center -rotate-[30deg] opacity-10 print:opacity-[0.15]">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-3xl font-bold whitespace-nowrap text-black">
                {certEmail} • {new Date(certificate.issuedAt).toLocaleString()}
              </p>
            ))}
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-3 rounded-md border border-slate-200 z-10"
          aria-hidden
        />
        <div className="relative z-20 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-md bg-blue-800 text-white">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <p className="mt-4 font-heading text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            EIB Group
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Training &amp; Organizational Development
          </p>

          <h1 className="mt-7 font-heading text-3xl font-bold md:text-4xl">
            Certificate of Completion
          </h1>
          <p className="mt-5 text-sm text-slate-500">This certifies that</p>
          <p className="mt-2 font-heading text-2xl font-bold text-blue-800 md:text-3xl">
            {certName}
          </p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-slate-600">
            has successfully completed all lessons and passed the assessment for
          </p>
          <p className="mt-2 text-balance font-heading text-xl font-semibold md:text-2xl">
            {course.title}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {course.category}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {course.level}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {course.durationHours} hours
            </span>
            {initiative && (
              <span className="rounded-full bg-blue-800/10 px-3 py-1 font-medium text-blue-800">
                {initiative}
              </span>
            )}
          </div>



          <div className="mt-10 grid w-full max-w-lg gap-6 sm:grid-cols-2">
            <div className="border-t border-slate-200 pt-2 text-center">
              <p className="text-sm font-medium">{issued}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Date issued</p>
            </div>
            <div className="border-t border-slate-200 pt-2 text-center">
              <p className="font-mono text-sm font-medium">{certificate.serial}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Certificate ID
              </p>
            </div>
          </div>

          <p className="mt-8 flex items-center gap-2 text-xs text-slate-500">
            <Award className="h-4 w-4 text-blue-800" />
            Verified record · EIB Group Learning Management System
          </p>
        </div>
      </article>
    </main>
  )
}
