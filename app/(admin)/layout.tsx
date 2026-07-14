import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionUser } from "@/app/actions/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser();
  const session = user ? { user } : null

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
