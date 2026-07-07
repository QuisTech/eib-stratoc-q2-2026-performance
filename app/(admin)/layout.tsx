import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const allowedEmails = [
    "michael.marquis@eibgroup.com",
    "chairman@eibgroup.com",
    "evp-ops-admin@eibgroup.com",
    "evp-finance-commercial@eibgroup.com"
  ]

  // Lock down the 90-day plan and strategy pages so ONLY the Group Head and top executives can view them.
  if (!session?.user || !allowedEmails.includes(session.user.email)) {
    redirect("/lms")
  }

  return <>{children}</>
}
