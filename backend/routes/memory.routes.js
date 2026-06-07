import express from 'express';
import { getMemories, createNoteMemory, deleteMemory, searchMemories } from '../controllers/memory.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMemories);
router.post('/note', protect, createNoteMemory);
router.get('/search', protect, searchMemories);
router.delete('/:id', protect, deleteMemory);

export default router;
