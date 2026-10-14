import rateLimit from 'express-rate-limit';

export const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 create requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many surprise creations from this IP. Please try again after a short break.',
  },
});

export const passcodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 15, // Limit 15 passcode attempts per 5 minutes to prevent brute forcing
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many incorrect attempts. Please wait 5 minutes before trying again.',
  },
});

export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});
