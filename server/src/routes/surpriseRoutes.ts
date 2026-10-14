import { Router } from 'express';
import {
  createSurprise,
  getSurprise,
  verifyPasscode,
  updateSurprise,
  healthCheck,
  submitAnswers,
  getAnswers,
} from '../controllers/surpriseController';
import { createLimiter, passcodeLimiter } from '../middleware/rateLimiter';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Surprises CRUD
router.post('/surprises', createLimiter, createSurprise);
router.get('/surprises/:id', getSurprise);
router.post('/surprises/:id/verify-passcode', passcodeLimiter, verifyPasscode);
router.put('/surprises/:id', updateSurprise);

// Relationship Answers (submission & private creator view)
router.post('/surprises/:id/answers', submitAnswers);
router.get('/surprises/:id/answers', getAnswers);

export default router;
