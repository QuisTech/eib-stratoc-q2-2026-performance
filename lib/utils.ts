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
  const role = userRole || "learner"
  const userSubLower = userSubsidiary ? userSubsidiary.trim().toLowerCase() : ""
  const courseSubsList = courseSubsidiaries ? courseSubsidiaries.split(",").map((s) => s.trim().toLowerCase()) : []
  const isDicoEmail = userEmail?.toLowerCase().endsWith("@dico.eibstratoc.com") || false

  // TOP SECRET CLEARANCE: BLACK courses are highly classified
  // Even Top Management (Group Heads) cannot bypass this unless they are in DCI.
  // Exception: The system Super Admin (role === "admin") can see everything.
  // Exception 2: Anyone with a @dico.eibstratoc.com email is considered part of DCI/BLACK.
  if (courseSubsList.includes("black")) {
    return (
      role === "admin" ||
      isDicoEmail ||
      userSubLower.startsWith("dci -") ||
      userSubLower === "directorate of clandestine & intelligence" ||
      userSubLower === "black"
    )
  }

  // Super Admins, Group Heads, Executives, and Leaders at the holding company (EIB Group) see all other courses
  if (role === "admin" || role === "group_head" || role === "executive" || (role === "lead" && userSubLower === "eib group")) {
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

  // Domain to subsidiary mapping
  const domainMap: Record<string, string> = {
    "@eibstratoc.com": "eib stratoc",
    "@psac.eibstratoc.com": "eib stratoc (psac)",
    "@poctova.com": "poctova",
    "@luftreiber.com": "luftreiber automobile",
    "@gigaforensics.com": "giga forensics",
    "@briechatlantic.com": "briech atlantic",
    "@briechuas.com": "briech uas",
    "@briechhospital.com": "briech hospital",
    "@brightfm.com": "bright fm",
    "@bef.com": "bef",
    "@eibgroup.com": "eib group",
    "@dci.com": "directorate of clandestine & intelligence"
  };

  const userEmailLower = userEmail?.toLowerCase() || "";
  let domainSubsidiary = "";
  for (const [domain, sub] of Object.entries(domainMap)) {
    if (userEmailLower.endsWith(domain)) {
      domainSubsidiary = sub;
      break;
    }
  }

  const userSubsToMatch = new Set<string>();
  if (userSubLower) userSubsToMatch.add(userSubLower);
  if (domainSubsidiary) userSubsToMatch.add(domainSubsidiary);

  // If the course is tagged as "EIB Group", it is a group-level strategic course visible ONLY to leaders/managers
  if (courseSubsList.includes("eib group")) {
    return role === "lead" || role === "admin" || role === "group_head" || role === "executive"
  }

  // If the user's email is @dico.eibstratoc.com, they can see ALL DCI courses ("dci - *")
  if (isDicoEmail && courseSubsList.some((s) => s.startsWith("dci -") || s === "directorate of clandestine & intelligence")) {
    return true
  }

  // If the user has no subsidiary (and wasn't caught by the DICO email check), they can only see global courses
  if (userSubsToMatch.size === 0) {
    return false
  }

  // Direct match
  if (courseSubsList.some(s => userSubsToMatch.has(s))) {
    return true
  }

  // Special Directorate wildcard logic:
  // Directorate of Clandestine & Intelligence lead/learners can see all "DCI - *" courses
  // Also, any specific DCI sub-department (e.g. "DCI - SAC") can see ALL other "DCI - *" courses
  for (const sub of Array.from(userSubsToMatch)) {
    if (sub === "directorate of clandestine & intelligence" || sub.startsWith("dci -")) {
      if (courseSubsList.some((s) => s.startsWith("dci -") || s === "directorate of clandestine & intelligence")) {
        return true
      }
    }
  }

  return false
}

