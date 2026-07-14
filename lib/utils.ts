import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format an amount of Nigerian Naira, e.g. 185000 -> "₦185,000". */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Determines whether a course is visible to a user based on its subsidiaries list,
 * the user's registered subsidiary, and the user's role.
 */
export function isCourseVisibleToUser(
  courseSubsidiaries: string | null,
  userSubsidiary: string | null,
  userRole: string | null,
  userEmail: string | null = null
): boolean {
  // As per Chairman's directive: all LMS courses are open to every staff regardless of subsidiary
  return true;
}

/**
 * Formats the course subsidiary list for UI display.
 * If the course belongs to a specific subsidiary, it prepends "Global, " to indicate global access.
 * e.g. "Poctova" -> "Global, Poctova"
 */
export function formatCourseSubsidiaries(subsidiaries: string | null): string {
  if (!subsidiaries || subsidiaries.trim() === "") return "Global"
  const formatted = subsidiaries.split(",").map(s => s.trim()).join(" · ")
  if (formatted.toLowerCase().includes("global")) {
    return formatted
  }
  return `Global, ${formatted}`
}

