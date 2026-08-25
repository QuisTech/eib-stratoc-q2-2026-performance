import type { User, Enrollment, Certificate } from "./types"

export function getStaticAdminSourceDataFallback(): {
  users: User[]
  enrollments: Enrollment[]
  certificates: Certificate[]
} {
  const now = new Date()

  const defaultUsers: User[] = [
    {
      id: "superadmin_1",
      name: "Michael Marquis",
      email: "michael.marquis@eibgroup.com",
      role: "admin",
      subsidiary: "EIB Group HQ",
      createdAt: now,
    },
    {
      id: "superadmin_2",
      name: "Training Admin",
      email: "training@eibstratoc.com",
      role: "admin",
      subsidiary: "EIB Stratoc",
      createdAt: now,
    },
  ]

  return {
    users: defaultUsers,
    enrollments: [],
    certificates: [],
  }
}
