/**
 * FormPilot - Independent Server-Side Provenance & Grounding Verification
 */

export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path || typeof path !== 'string') return undefined;

  // Convert array notation like 'education[0].degree' -> 'education.0.degree'
  const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
  const parts = normalizedPath.split('.');
  let current = obj;

  for (const part of parts) {
    // Protect against prototype pollution
    if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
      return undefined;
    }
    if (current == null || typeof current !== 'object') return undefined;
    current = current[part];
  }
  return current;
}

export function verifyProvenance(
  profile: any,
  ans: any
): { isVerified: boolean; matchedPath?: string } {
  if (!ans.sourceDetail || typeof ans.sourceDetail !== 'string') {
    return { isVerified: false };
  }
  const cleanPath = ans.sourceDetail.trim();
  const profileVal = getNestedValue(profile, cleanPath);
  if (profileVal === undefined || profileVal === null) {
    return { isVerified: false };
  }

  // Reject non-array objects (e.g. { ... } would evaluate to "[object Object]")
  if (typeof profileVal === 'object' && !Array.isArray(profileVal)) {
    return { isVerified: false };
  }

  const pStr = String(profileVal).toLowerCase().trim();
  const aStr = String(ans.answer || '').toLowerCase().trim();

  if (!aStr || !pStr) {
    return { isVerified: false };
  }

  // 1. Exact match (case-insensitive)
  if (pStr === aStr) {
    return { isVerified: true, matchedPath: cleanPath };
  }

  // 2. Substring match only if BOTH strings have sufficient length (>= 3 chars)
  // This prevents short answers ("no", "yes", "in", "a") from falsely matching inside unrelated strings ("Node.js", "Boston")
  if (aStr.length >= 3 && pStr.length >= 3 && (pStr.includes(aStr) || aStr.includes(pStr))) {
    return { isVerified: true, matchedPath: cleanPath };
  }

  return { isVerified: false };
}
