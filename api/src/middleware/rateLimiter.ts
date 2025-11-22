// Simple rate limiting middleware for Elysia
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private max: number;
  private windowMs: number;

  constructor(max: number = 10, windowMs: number = 60000) {
    this.max = max;
    this.windowMs = windowMs;

    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || entry.resetTime < now) {
      // New entry or expired
      const resetTime = now + this.windowMs;
      this.store.set(identifier, { count: 1, resetTime });
      return { allowed: true, remaining: this.max - 1, resetTime };
    }

    if (entry.count >= this.max) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime };
    }

    // Increment count
    entry.count++;
    return { allowed: true, remaining: this.max - entry.count, resetTime: entry.resetTime };
  }

  reset(identifier: string) {
    this.store.delete(identifier);
  }
}

export function createRateLimiter(max?: number, windowMs?: number) {
  return new RateLimiter(max, windowMs);
}
