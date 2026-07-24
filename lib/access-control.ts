export const SUPER_ADMIN_EMAILS = [
  "michael.marquis@eibgroup.com",
  "training@eibstratoc.com"
];

export const SUPER_ADMIN_EMAIL = "michael.marquis@eibgroup.com";

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
  
  const normalizedEmail = email?.toLowerCase().trim();
  if (normalizedEmail && SUPER_ADMIN_EMAILS.includes(normalizedEmail)) return true;
  if (role === 'admin' || role === 'super_admin' || role === 'group_head') return true;
  
  return false;
}

