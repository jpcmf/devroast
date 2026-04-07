/**
 * Rate limiting module for DevRoast submissions
 * 
 * Implements two-tier rate limiting:
 * 1. Per-IP limit: Max 5 submissions per hour
 * 2. Global cooldown: 30 seconds minimum between any submissions
 */

interface RateLimitEntry {
  count: number;
  timestamp: number;
  lastSubmission: number;
}

// In-memory storage for per-IP submission tracking
const ipSubmissions: Map<string, RateLimitEntry> = new Map();

// Timestamp of the last global submission
let lastGlobalSubmission: number = 0;

// Cleanup old entries every minute
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 3600000; // 1 hour in milliseconds

  for (const [ip, entry] of ipSubmissions.entries()) {
    if (entry.timestamp < oneHourAgo) {
      ipSubmissions.delete(ip);
    }
  }
}, 60000); // Run every minute

export interface RateLimitResult {
  allowed: boolean;
  reason?: 'IP_LIMIT' | 'GLOBAL_COOLDOWN';
  resetTime?: number; // Unix timestamp when they can try again
}

/**
 * Check if a submission should be allowed based on rate limits
 * 
 * @param clientIp - The client's IP address
 * @returns RateLimitResult with allowed status and reset time if blocked
 */
export function checkRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now();

  // Check per-IP rate limit (5 submissions per hour)
  const ipEntry = ipSubmissions.get(clientIp);
  if (ipEntry && now - ipEntry.timestamp < 3600000) {
    // Within the 1-hour window
    if (ipEntry.count >= 5) {
      return {
        allowed: false,
        reason: 'IP_LIMIT',
        resetTime: ipEntry.timestamp + 3600000,
      };
    }
  }

  // Check global cooldown (30 seconds between any submissions)
  const timeSinceLastSubmission = now - lastGlobalSubmission;
  if (timeSinceLastSubmission < 30000) {
    return {
      allowed: false,
      reason: 'GLOBAL_COOLDOWN',
      resetTime: lastGlobalSubmission + 30000,
    };
  }

  return { allowed: true };
}

/**
 * Record a successful submission for rate limiting purposes
 * 
 * @param clientIp - The client's IP address
 */
export function recordSubmission(clientIp: string): void {
  const now = Date.now();
  const entry = ipSubmissions.get(clientIp);

  if (entry) {
    // Increment counter for existing IP
    entry.count++;
    entry.lastSubmission = now;
  } else {
    // Create new entry for IP
    ipSubmissions.set(clientIp, {
      count: 1,
      timestamp: now,
      lastSubmission: now,
    });
  }

  // Update global last submission timestamp
  lastGlobalSubmission = now;
}

/**
 * Get remaining minutes until an IP can submit again
 * 
 * @param resetTime - Unix timestamp from RateLimitResult
 * @returns Minutes remaining (rounded up)
 */
export function getMinutesUntilReset(resetTime: number): number {
  return Math.ceil((resetTime - Date.now()) / 60000);
}
