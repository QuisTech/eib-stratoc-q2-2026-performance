function isCourseVisibleToUser(courseSubsidiaries, userSubsidiary, userRole) {
  const role = userRole || "learner"
  if (role === "admin" || role === "group_head") return true
  if (!courseSubsidiaries || courseSubsidiaries.trim() === "") return true
  const courseSubsList = courseSubsidiaries.split(",").map((s) => s.trim().toLowerCase())
  if (courseSubsList.includes("global")) return true
  if (courseSubsList.includes("eib group")) {
    return role === "lead" || role === "admin" || role === "group_head"
  }
  if (!userSubsidiary) return false
  const userSubLower = userSubsidiary.trim().toLowerCase()
  if (courseSubsList.includes("black")) {
    return userSubLower.startsWith("dci -") || userSubLower === "directorate of clandestine & intelligence" || userSubLower === "black"
  }
  if (courseSubsList.includes(userSubLower)) return true
  if (userSubLower === "directorate of clandestine & intelligence") {
    return courseSubsList.some((s) => s.startsWith("dci -"))
  }
  return false
}

const courseSubsidiaries = "EIB Group";
const userSubsidiary = "Directorate of Clandestine & Intelligence";
const userRole = "learner";

const isVisible = isCourseVisibleToUser(courseSubsidiaries, userSubsidiary, userRole);
console.log("Is visible:", isVisible);
