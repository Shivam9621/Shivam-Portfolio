interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipMap = new Map<string, RateLimitRecord>();

// Periodic cleanup to avoid memory leak
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipMap.entries()) {
      if (now > record.resetTime) {
        ipMap.delete(key);
      }
    }
  }, 60_000);
  if (typeof interval === "object" && "unref" in interval) {
    (interval as any).unref();
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory sliding-window rate limiter for sensitive admin endpoints.
 * @param identifier IP or client key
 * @param limit Max allowed requests within windowMs (default 60)
 * @param windowMs Window duration in milliseconds (default 60,000ms / 1 min)
 */
export function rateLimit(
  identifier: string,
  limit = 60,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const record = ipMap.get(identifier);

  if (!record || now > record.resetTime) {
    ipMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.ceil(record.resetTime / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: Math.ceil(record.resetTime / 1000),
  };
}
