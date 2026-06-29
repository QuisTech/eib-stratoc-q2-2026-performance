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

  // Lock down the 90-day plan and strategy pages so ONLY the Group Head can view them.
  if (!session?.user || session.user.email !== "michael.marquis@eibgroup.com") {
    redirect("/lms")
  }

  return <>{children}</>
}
