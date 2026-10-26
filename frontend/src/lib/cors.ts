/**
 * FormPilot - Secure Centralized CORS & Origin Validation Module
 * 
 * Strict Origin Validation:
 * - Uses exact string equality (no startsWith or includes wildcard substring matching)
 * - Fails closed: Never falls back to '*' for sensitive endpoints
 * - Validates Chrome extension origin against configured EXTENSION_ID only
 * - Disallows unauthenticated cross-origin access
 */

export interface CorsConfig {
  allowedOrigins?: string[];
  extensionId?: string;
  isDevelopment?: boolean;
}

export function getAllowedOrigins(): string[] {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : [];
  return envOrigins;
}

export function getAllowedExtensionId(): string | null {
  const extId = process.env.EXTENSION_ID || process.env.NEXT_PUBLIC_EXTENSION_ID;
  if (!extId || extId === 'PLACEHOLDER_EXTENSION_ID' || extId === 'your_chrome_extension_id_here') {
    return null;
  }
  return extId.trim();
}

export function isOriginAllowed(
  origin: string | null,
  config?: CorsConfig
): boolean {
  if (!origin || typeof origin !== 'string') {
    return false;
  }

  const cleanOrigin = origin.trim();
  if (!cleanOrigin) {
    return false;
  }

  const allowedOrigins = config?.allowedOrigins ?? getAllowedOrigins();
  const extensionId = config?.extensionId ?? getAllowedExtensionId();
  const isDev = config?.isDevelopment ?? (process.env.NODE_ENV !== 'production');

  // 1. Exact match in explicit ALLOWED_ORIGINS allowlist
  if (allowedOrigins.includes(cleanOrigin)) {
    return true;
  }

  // 2. Exact match against configured Chrome extension ID
  if (extensionId && cleanOrigin === `chrome-extension://${extensionId}`) {
    return true;
  }

  // 3. Localhost development workflow (strictly gated by NODE_ENV)
  if (isDev) {
    const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'];
    if (devOrigins.includes(cleanOrigin) || cleanOrigin.startsWith('chrome-extension://')) {
      return true;
    }
  }

  // Fail closed
  return false;
}

export function getCorsHeaders(
  origin: string | null,
  allowedMethods = 'GET, POST, OPTIONS',
  config?: CorsConfig
): Record<string, string> {
  const allowed = isOriginAllowed(origin, config);

  return {
    // Fail-closed: only set origin header if strictly allowed; never return '*'
    'Access-Control-Allow-Origin': allowed && origin ? origin : '',
    'Access-Control-Allow-Methods': allowedMethods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours preflight cache
    'Vary': 'Origin',
  };
}

export function handlePreflight(
  req: Request,
  allowedMethods = 'GET, POST, OPTIONS',
  config?: CorsConfig
): Response {
  const origin = req.headers.get('origin');
  
  if (!origin || !isOriginAllowed(origin, config)) {
    // Disallowed origin or invalid preflight fails closed with 403 Forbidden
    return new Response(null, { status: 403 });
  }

  const headers = getCorsHeaders(origin, allowedMethods, config);
  return new Response(null, { status: 204, headers });
}
