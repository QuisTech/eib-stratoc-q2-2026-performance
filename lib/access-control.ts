export const SUPER_ADMIN_EMAIL = "michael.marquis@eibgroup.com"

export function isSuperAdmin(user?: { email?: string | null, role?: string } | string | null) {
  if (!user) return false;
  let email = null;
  let role = null;
  
  if (typeof user === 'string') {
    email = user;
  } else {
    email = user.email;
    role = user.role;
  }
  
  if (email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL) return true;
  if (role === 'admin') return true;
  
  return false;
}
