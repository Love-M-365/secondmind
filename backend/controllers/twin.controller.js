import DigitalTwin from '../models/digitalTwin.model.js';
import Memory from '../models/memory.model.js';
import { queryModel } from '../services/gemini.service.js';

/**
 * Rebuilds the user's Digital Twin using all memories.
 */
export const rebuildTwinHelper = async (userId) => {
  try {
    const memories = await Memory.find({ userId });
    if (memories.length === 0) {
      // Create empty default twin if no memories exist
      let twin = await DigitalTwin.findOne({ userId });
      if (!twin) {
        twin = await DigitalTwin.create({ userId });
      }
      return twin;
    }

    // Join memory summaries and first few lines of content
    const textContext = memories.map((m, idx) => {
      return `Document #${idx + 1} (Type: ${m.sourceType}):
Summary: ${m.summary || 'N/A'}
Content Excerpt: ${m.content.substring(0, 1500)}
---`;
    }).join('\n\n');

    const prompt = `You are a Digital Twin Engine. You must analyze the provided memories/documents of this user and construct a structured profile of their skillset, passions, goals, strengths, and weaknesses.
Analyze carefully, extracting key details.

Return ONLY a valid JSON object matching this schema exactly:
{
  "skills": ["Skill 1", "Skill 2"],
  "interests": ["Interest 1", "Interest 2"],
  "goals": ["Goal 1", "Goal 2"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}
Do not output any introductory or explanatory text. Just the raw JSON.

Context memories:
${textContext}`;

    const jsonText = await queryModel(prompt, true);
    const parsedData = JSON.parse(jsonText);

    let twin = await DigitalTwin.findOne({ userId });
    if (!twin) {
      twin = new DigitalTwin({ userId });
    }

    twin.skills = parsedData.skills || [];
    twin.interests = parsedData.interests || [];
    twin.goals = parsedData.goals || [];
    twin.strengths = parsedData.strengths || [];
    twin.weaknesses = parsedData.weaknesses || [];
    twin.updatedAt = new Date();

    await twin.save();
    console.log(`[Twin Engine] Successfully rebuilt digital twin for User: ${userId}`);
    return twin;
  } catch (error) {
    console.error(`[Twin Engine] Error rebuilding digital twin for User ${userId}:`, error);
    return null;
  }
};

export const getTwin = async (req, res) => {
  try {
    let twin = await DigitalTwin.findOne({ userId: req.user._id });
    
    // If no twin exists, create a default empty one
    if (!twin) {
      twin = await DigitalTwin.create({ userId: req.user._id });
    }

    res.status(200).json({ success: true, twin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forceRebuildTwin = async (req, res) => {
  try {
    const twin = await rebuildTwinHelper(req.user._id);
    if (!twin) {
      return res.status(400).json({ success: false, message: 'Could not rebuild twin. Make sure you have added memories.' });
    }
    res.status(200).json({ success: true, twin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTwin = async (req, res) => {
  try {
    const { skills, interests, goals, strengths, weaknesses } = req.body;
    
    let twin = await DigitalTwin.findOne({ userId: req.user._id });
    if (!twin) {
      twin = new DigitalTwin({ userId: req.user._id });
    }

    if (skills) twin.skills = skills;
    if (interests) twin.interests = interests;
    if (goals) twin.goals = goals;
    if (strengths) twin.strengths = strengths;
    if (weaknesses) twin.weaknesses = weaknesses;
    twin.updatedAt = new Date();

    await twin.save();
    res.status(200).json({ success: true, twin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
