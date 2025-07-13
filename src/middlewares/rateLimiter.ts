import rateLimit from 'express-rate-limit';

/**
 * Creates an API rate limiter middleware using express-rate-limit.
 * 
 * The rate limiter uses the following environment variables:
 * - RATE_LIMIT_TIME: Time window in seconds (default: 10 seconds).
 * - RATE_LIMIT_MAX_REQUEST: Maximum number of requests allowed in the window (default: 1000).
 * 
 * The limiter identifies users by their user ID if available, otherwise by IP address.
 * 
 * @returns {import('express').RequestHandler} Express middleware for rate limiting.
 */
export function createApiRateLimiter() {
  return rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_TIME || '10', 10) * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUEST || '1000', 10),
    keyGenerator: (req) => req.user ? (req.user as any)._id?.toString() : req.ip,
    message: 'Too many requests, please try again later.'
  });
} 