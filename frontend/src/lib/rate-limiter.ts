/**
 * FormPilot - Centralized Fail-Closed Firestore Rate Limiter
 * 
 * Features:
 * - Atomic document transactions protecting against race conditions and concurrency spikes
 * - Fail-closed enforcement: Rejects requests with HTTP 503 if Firestore is unreachable
 * - Granular per-endpoint configurable quotas (generate, parse-resume, corrections)
 * - 24-hour sliding reset window with counter and timestamp validation
 * - Isolated dependency injection (db parameter) for safe zero-database unit and integration tests
 */

export type RateLimitAction = 'generate' | 'parse-resume' | 'corrections';

export interface RateLimitOptions {
  uid: string;
  action: RateLimitAction;
  db: any;
  maxRequests?: number;
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  status: 200 | 429 | 503;
  error?: string;
  count: number;
  remaining: number;
  resetTime: number;
}

export const DEFAULT_RATE_LIMITS: Record<RateLimitAction, number> = {
  'generate': 1000,       // Standard form autofill generations
  'parse-resume': 30,     // Heavyweight multimodal/PDF parsing operations
  'corrections': 200,     // User phrasing classification operations
};

export const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getDefaultLimitForAction(action: RateLimitAction): number {
  if (action === 'generate') {
    return (
      parseInt(process.env.RATE_LIMIT_GENERATE_MAX || '', 10) ||
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '', 10) ||
      DEFAULT_RATE_LIMITS.generate
    );
  }
  if (action === 'parse-resume') {
    return (
      parseInt(process.env.RATE_LIMIT_PARSE_RESUME_MAX || '', 10) ||
      DEFAULT_RATE_LIMITS['parse-resume']
    );
  }
  if (action === 'corrections') {
    return (
      parseInt(process.env.RATE_LIMIT_CORRECTIONS_MAX || '', 10) ||
      DEFAULT_RATE_LIMITS.corrections
    );
  }
  return 100;
}

export async function enforceRateLimit({
  uid,
  action,
  db,
  maxRequests,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  if (!db) {
    return {
      allowed: false,
      status: 503,
      error: 'Rate limiting store unavailable.',
      count: 0,
      remaining: 0,
      resetTime: 0,
    };
  }

  if (!uid || typeof uid !== 'string' || !uid.trim()) {
    return {
      allowed: false,
      status: 503,
      error: 'Invalid user identifier for rate limiting.',
      count: 0,
      remaining: 0,
      resetTime: 0,
    };
  }

  const cleanUid = uid.trim();
  const limit = maxRequests ?? getDefaultLimitForAction(action);
  const windowDuration = windowMs ?? (parseInt(process.env.RATE_LIMIT_WINDOW_MS || '', 10) || DEFAULT_WINDOW_MS);
  const now = Date.now();

  const docId = `${cleanUid}_${action}`;
  const rateLimitRef = db.collection('rateLimits').doc(docId);

  try {
    let currentCount = 0;
    let currentReset = now + windowDuration;

    await db.runTransaction(async (transaction: any) => {
      const doc = await transaction.get(rateLimitRef);
      if (!doc.exists) {
        currentCount = 1;
        currentReset = now + windowDuration;
        transaction.set(rateLimitRef, { count: 1, timestamp: now, action });
      } else {
        const data = doc.data() || {};
        const count = typeof data.count === 'number' && Number.isFinite(data.count) && data.count > 0 ? data.count : 0;
        const timestamp = typeof data.timestamp === 'number' && Number.isFinite(data.timestamp) && data.timestamp > 0 ? data.timestamp : 0;

        if (now - timestamp > windowDuration) {
          // Sliding 24h window elapsed, reset counter
          currentCount = 1;
          currentReset = now + windowDuration;
          transaction.set(rateLimitRef, { count: 1, timestamp: now, action });
        } else if (count >= limit) {
          currentCount = count;
          currentReset = timestamp + windowDuration;
          const err: any = new Error('RateLimitExceeded');
          err.resetTime = currentReset;
          err.count = count;
          throw err;
        } else {
          currentCount = count + 1;
          currentReset = timestamp + windowDuration;
          transaction.update(rateLimitRef, { count: count + 1 });
        }
      }
    });

    return {
      allowed: true,
      status: 200,
      count: currentCount,
      remaining: Math.max(0, limit - currentCount),
      resetTime: currentReset,
    };
  } catch (err: any) {
    if (err.message === 'RateLimitExceeded') {
      const remainingHours = Math.ceil(Math.max(0, (err.resetTime || now) - now) / (1000 * 60 * 60));
      return {
        allowed: false,
        status: 429,
        error: `Rate limit exceeded for ${action} (${limit.toLocaleString()} requests per 24-hour window). Resets in ~${remainingHours}h.`,
        count: err.count || limit,
        remaining: 0,
        resetTime: err.resetTime || now + windowDuration,
      };
    }

    console.error(`[RateLimiter] Fail-closed: Firestore transaction failed for ${action} (User: ${cleanUid}):`, err.message || err);
    return {
      allowed: false,
      status: 503,
      error: 'Rate limiting service temporarily unavailable. Please retry later.',
      count: 0,
      remaining: 0,
      resetTime: 0,
    };
  }
}
