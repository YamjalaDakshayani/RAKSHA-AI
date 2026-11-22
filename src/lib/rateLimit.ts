import crypto from "crypto";

interface RateLimitConfig {
  guestLimit: number;
  userLimit: number;
  windowMinutes: number;
}

function getConfig(): RateLimitConfig {
  return {
    guestLimit: Number(process.env.RATE_LIMIT_GUEST) || 10,
    userLimit: Number(process.env.RATE_LIMIT_USER) || 40,
    windowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MIN) || 10,
  };
}

export function hashIdentifier(identifier: string): string {
  const salt = process.env.IP_HASH_SALT || "nova_default_salt_secure_2025";
  return crypto.createHash("sha256").update(`${identifier}:${salt}`).digest("hex");
}

// In-memory rate limiting store (always available even if Supabase is offline)
interface WindowData {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, WindowData>();

// Periodic memory cleanup
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of memoryStore.entries()) {
      if (now > data.resetAt) {
        memoryStore.delete(key);
      }
    }
  }, 60000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export async function checkRateLimit(params: {
  userId?: string | null;
  clientIp?: string | null;
}): Promise<RateLimitResult> {
  const config = getConfig();
  const windowMs = config.windowMinutes * 60 * 1000;
  const now = Date.now();

  const isUser = Boolean(params.userId);
  const limit = isUser ? config.userLimit : config.guestLimit;

  // Use hashed userId or hashed IP
  const rawId = params.userId ? `user_${params.userId}` : `ip_${params.clientIp || "127.0.0.1"}`;
  const key = hashIdentifier(rawId);

  const existing = memoryStore.get(key);

  if (!existing || now > existing.resetAt) {
    // New window
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (existing.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: retryAfter,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit,
    remaining: limit - existing.count,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}
