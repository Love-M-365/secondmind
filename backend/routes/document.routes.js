import express from 'express';
import multer from 'multer';
import { uploadDocument } from '../controllers/document.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Setup multer in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

router.post('/upload', protect, upload.single('file'), uploadDocument);

export default router;
