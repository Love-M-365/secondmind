import express from 'express';
import { simulateFuture, getWeeklyPlan } from '../controllers/agent.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/simulate', protect, simulateFuture);
router.get('/weekly-plan', protect, getWeeklyPlan);

export default router;
