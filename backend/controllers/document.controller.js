import Memory from '../models/memory.model.js';
import { extractTextFromFile, cleanText } from '../services/extractor.service.js';
import { generateSummary } from '../services/gemini.service.js';
import { rebuildTwinHelper } from './twin.controller.js';

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file;
    console.log(`Received file upload: ${file.originalname} (${file.mimetype})`);

    // 1. Extract raw text from file
    const rawText = await extractTextFromFile(file.buffer, file.mimetype);
    
    // 2. Clean extracted text
    const cleanedText = cleanText(rawText);

    if (!cleanedText) {
      return res.status(400).json({ 
        success: false, 
        message: 'Could not extract any readable text content from this file.' 
      });
    }

    // 3. Generate summary via Gemini service
    console.log(`Generating AI summary for: ${file.originalname}...`);
    const summary = await generateSummary(cleanedText);

    // 4. Create memory entry in MongoDB
    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
    const memory = await Memory.create({
      userId: req.user._id,
      sourceType: 'document',
      content: cleanedText,
      summary: summary,
      metadata: {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        wordCount: wordCount
      }
    });

    console.log(`Saved document memory: ${memory._id} for User: ${req.user.email}`);

    // 5. Asynchronously trigger digital twin update in the background
    // This allows the response to return quickly without blocking the user
    rebuildTwinHelper(req.user._id)
      .then(twin => {
        if (twin) {
          console.log(`Background digital twin rebuild complete for user: ${req.user.email}`);
        }
      })
      .catch(err => {
        console.error('Background digital twin rebuild error:', err);
      });

    res.status(201).json({
      success: true,
      message: 'Document uploaded and memory ingested successfully',
      memory: {
        id: memory._id,
        fileName: file.originalname,
        summary: memory.summary,
        wordCount: wordCount,
        createdAt: memory.createdAt
      }
    });

  } catch (error) {
    console.error('Error in document upload controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
