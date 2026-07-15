export const SUPER_ADMIN_EMAIL = "michael.marquis@eibgroup.com"

export function isSuperAdminEmail(email?: string | null) {
  return email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL
}
