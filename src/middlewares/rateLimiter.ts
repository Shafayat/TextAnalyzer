import rateLimit from 'express-rate-limit';

export function createApiRateLimiter() {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_TIME || '10', 10) * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUEST || '1000', 10),
    keyGenerator: (req) => req.user ? (req.user as any)._id?.toString() : req.ip,
    message: 'Too many requests, please try again later.'
  });
} 