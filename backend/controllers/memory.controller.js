import Memory from '../models/memory.model.js';
import { generateSummary } from '../services/gemini.service.js';
import { queryMemoryAgent } from '../services/agents/agent.service.js';
import { rebuildTwinHelper } from './twin.controller.js';

export const getMemories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };
    
    if (type) {
      filter.sourceType = type;
    }

    const memories = await Memory.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, memories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMemories = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query parameter (q) is required' });
    }

    console.log(`Running Memory Agent search for: "${q}"...`);
    const searchResult = await queryMemoryAgent(req.user._id, q);

    res.status(200).json({
      success: true,
      answer: searchResult.answer,
      relevantMemories: searchResult.relevantMemories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNoteMemory = async (req, res) => {
  try {
    const { content, sourceType } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const type = sourceType || 'note';

    console.log(`Generating AI summary for new ${type} note...`);
    const summary = await generateSummary(content);

    const memory = await Memory.create({
      userId: req.user._id,
      sourceType: type,
      content,
      summary,
      metadata: {
        wordCount: content.split(/\s+/).filter(Boolean).length
      }
    });

    console.log(`Saved note memory: ${memory._id} for User: ${req.user.email}`);

    // Asynchronously trigger digital twin update in the background
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
      message: 'Note added to memory database successfully',
      memory
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found or unauthorized' });
    }

    console.log(`Deleted memory: ${req.params.id}`);

    // Asynchronously trigger digital twin update in the background
    rebuildTwinHelper(req.user._id)
      .then(twin => {
        if (twin) {
          console.log(`Background digital twin rebuild complete for user: ${req.user.email}`);
        }
      })
      .catch(err => {
        console.error('Background digital twin rebuild error:', err);
      });

    res.status(200).json({ success: true, message: 'Memory removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
