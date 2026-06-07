import express from 'express';
import { getTwin, forceRebuildTwin, updateTwin } from '../controllers/twin.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getTwin);
router.post('/rebuild', protect, forceRebuildTwin);
router.post('/update', protect, updateTwin);

export default router;
