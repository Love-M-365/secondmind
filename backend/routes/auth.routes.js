import express from 'express';
import { syncUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sync', protect, syncUser);
router.get('/me', protect, getMe);

export default router;
