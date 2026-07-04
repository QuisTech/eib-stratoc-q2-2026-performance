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
  userRole: string | null
): boolean {
  const role = userRole || "learner"

  const userSubLower = userSubsidiary ? userSubsidiary.trim().toLowerCase() : ""

  const courseSubsList = courseSubsidiaries ? courseSubsidiaries.split(",").map((s) => s.trim().toLowerCase()) : []

  // TOP SECRET CLEARANCE: BLACK courses are highly classified
  // Even Top Management (Group Heads) cannot bypass this unless they are in DCI.
  // Exception: The system Super Admin (role === "admin") can see everything.
  if (courseSubsList.includes("black")) {
    return (
      role === "admin" ||
      userSubLower.startsWith("dci -") ||
      userSubLower === "directorate of clandestine & intelligence" ||
      userSubLower === "black"
    )
  }

  // Super Admins, Group Heads, and Leaders at the holding company (EIB Group) see all other courses
  if (role === "admin" || role === "group_head" || (role === "lead" && userSubLower === "eib group")) {
    return true
  }

  // If no course subsidiaries list is specified, it is considered global/general
  if (!courseSubsidiaries || courseSubsidiaries.trim() === "") {
    return true
  }

  // If the course is tagged as "Global", it is visible to everyone across the group regardless of role
  if (courseSubsList.includes("global")) {
    return true
  }

  // If the course is tagged as "EIB Group", it is a group-level strategic course visible ONLY to leaders/managers
  if (courseSubsList.includes("eib group")) {
    return role === "lead" || role === "admin" || role === "group_head"
  }

  // If the user has no subsidiary, they can only see global courses
  if (!userSubsidiary) {
    return false
  }

  // Direct match
  if (courseSubsList.includes(userSubLower)) {
    return true
  }

  // Special Directorate wildcard logic:
  // Directorate of Clandestine & Intelligence lead/learners can see all "DCI - *" courses
  if (userSubLower === "directorate of clandestine & intelligence") {
    return courseSubsList.some((s) => s.startsWith("dci -"))
  }

  return false
}

/**
 * Determines whether a course should be classified as a "Strategic Briefing" 
 * instead of a standard training course.
 * Briefings are presentations from the management retreat (customContent is not null) 
 * that are NOT tagged as 'Global'.
 */
export function isStrategicBriefing(
  courseSubsidiaries: string | null,
  customContent: string | null | any
): boolean {
  if (!customContent) return false
  if (!courseSubsidiaries) return false
  
  const courseSubsList = courseSubsidiaries.split(",").map((s) => s.trim().toLowerCase())
  return !courseSubsList.includes("global")
}
