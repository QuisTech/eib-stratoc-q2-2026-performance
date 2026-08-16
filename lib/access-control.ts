export const SUPER_ADMIN_EMAILS = [
  "michael.marquis@eibgroup.com",
  "training@eibstratoc.com"
];

export const SUPER_ADMIN_EMAIL = "michael.marquis@eibgroup.com";

/**
 * STRICT SUPER ADMIN CHECK:
 * Strictly matches ONLY the 2 authorized email addresses:
 * 1. michael.marquis@eibgroup.com
 * 2. training@eibstratoc.com
 *
 * No other person, whether admin, lead, group_head, or executive qualifies.
 */
export function isStrictSuperAdmin(user?: { email?: string | null, role?: string } | string | null): boolean {
  if (!user) return false;
  let email: string | null | undefined = null;
  
  if (typeof user === 'string') {
    email = user;
  } else {
    email = user.email;
  }
  
  const normalizedEmail = email?.toLowerCase().trim();
  return Boolean(normalizedEmail && SUPER_ADMIN_EMAILS.includes(normalizedEmail));
}

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

