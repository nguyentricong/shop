import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

// Rate limiter cho API endpoints
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') / 1000, // 15 minutes
  blockDuration: 60 * 15, // Block for 15 minutes after exceeding limit
});

// Rate limiter cho purchase (strict hơn)
const purchaseRateLimiter = new RateLimiterMemory({
  points: 3, // 3 purchases
  duration: 60 * 60, // per hour
  blockDuration: 60 * 60 * 2, // Block for 2 hours
});

function getClientIdentifier(request: NextRequest): string {
  // Lấy IP từ các headers khác nhau (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

export async function checkRateLimit(request: NextRequest, type: 'api' | 'purchase' = 'api') {
  const identifier = getClientIdentifier(request);
  const limiter = type === 'purchase' ? purchaseRateLimiter : rateLimiter;

  try {
    await limiter.consume(identifier);
    return { success: true, identifier };
  } catch (rejRes: any) {
    const msBeforeNext = rejRes.msBeforeNext || 900000;
    const minutesBeforeNext = Math.ceil(msBeforeNext / 60000);
    
    return {
      success: false,
      identifier,
      msBeforeNext,
      minutesBeforeNext,
      error: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${minutesBeforeNext} phút.`
    };
  }
}

// Reset rate limit cho một IP (dùng cho admin)
export async function resetRateLimit(identifier: string, type: 'api' | 'purchase' = 'api') {
  const limiter = type === 'purchase' ? purchaseRateLimiter : rateLimiter;
  await limiter.delete(identifier);
  return { success: true };
}
