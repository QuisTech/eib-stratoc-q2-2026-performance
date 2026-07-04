"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Compass, CalendarRange, BarChart3, Users, GraduationCap, ShieldCheck, LogIn, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"
import { SignOutButton } from "@/components/sign-out-button"

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/strategy", label: "Strategic Plan", icon: Compass },
  { href: "/roadmap", label: "Roadmap", icon: CalendarRange },
  { href: "/dashboard", label: "ROI Dashboard", icon: BarChart3 },
  { href: "/input", label: "Subsidiary Input", icon: Users },
  { href: "/lms", label: "LMS", icon: GraduationCap },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const role = (session?.user as { role?: string } | undefined)?.role
  const isManager = role === "lead" || role === "admin" || role === "group_head"

  return (
    <header className="no-print sticky top-0 z-40 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-sm font-semibold tracking-wide">
              EIB GROUP
            </span>
            <span className="block text-xs text-sidebar-foreground/70">
              Training &amp; OD · 90-Day Plan
            </span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}

          {!isPending && session?.user && isManager && (
            <>
              <Link
                href="/briefings"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/briefings")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <ClipboardList className="h-4 w-4" />
                Briefings
              </Link>
              <Link
                href="/lms/admin"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/lms/admin")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            </>
          )}

          <span className="mx-1 hidden h-5 w-px bg-sidebar-border md:block" aria-hidden />

          {!isPending && session?.user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[12ch] truncate text-xs text-sidebar-foreground/70 sm:block">
                {session.user.name || session.user.email}
              </span>
              <SignOutButton className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
            </div>
          ) : (
            <Link
              href="/sign-in"
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
