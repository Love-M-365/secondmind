import Memory from '../../models/memory.model.js';
import DigitalTwin from '../../models/digitalTwin.model.js';
import { queryModel } from '../gemini.service.js';

/**
 * Memory Agent: Searches, filters, and ranks memories to answer queries.
 */
export const queryMemoryAgent = async (userId, queryText) => {
  // 1. Retrieve all memories for this user
  const memories = await Memory.find({ userId }).sort({ createdAt: -1 });

  if (memories.length === 0) {
    return {
      answer: "I don't have any memories stored for you yet. Please upload documents or add notes to help me learn about you!",
      relevantMemories: []
    };
  }

  // 2. Simple keyword-based keyword/text ranking
  const searchKeywords = queryText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const scoredMemories = memories.map(memory => {
    let score = 0;
    const contentLower = memory.content.toLowerCase();
    const summaryLower = (memory.summary || '').toLowerCase();
    const typeLower = (memory.sourceType || '').toLowerCase();

    searchKeywords.forEach(keyword => {
      if (contentLower.includes(keyword)) score += 5;
      if (summaryLower.includes(keyword)) score += 10; // Summaries carry more weight
      if (typeLower.includes(keyword)) score += 3;
    });

    return { memory, score };
  });

  // Filter memories with score > 0, or take top 5 most recent if query is general
  let filtered = scoredMemories
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.memory);

  if (filtered.length === 0) {
    // Return top 5 most recent memories as fallback
    filtered = memories.slice(0, 5);
  } else {
    // Limit to top 5 scored memories
    filtered = filtered.slice(0, 5);
  }

  // 3. Construct a grounding context for Gemini
  const contextText = filtered.map((m, idx) => {
    return `[Memory #${idx + 1}] Type: ${m.sourceType}\nSummary: ${m.summary || 'N/A'}\nContent excerpt: ${m.content.substring(0, 800)}\nCreated At: ${m.createdAt}\n---`;
  }).join('\n\n');

  const systemPrompt = `You are the Memory Agent of SecondMind (the user's digital twin platform). 
Your task is to answer the user's query using only the provided context of memories. 
If the information is not present in the memories, state that you cannot find it, but answer as best as possible using the general facts that are available.
Be direct, professional, and act as a perfect cognitive extension.

Context memories:
${contextText}

User Query: "${queryText}"`;

  const answer = await queryModel(systemPrompt, false);

  return {
    answer,
    relevantMemories: filtered.map(m => ({
      id: m._id,
      sourceType: m.sourceType,
      summary: m.summary,
      createdAt: m.createdAt
    }))
  };
};

/**
 * Learning Agent: Identifies skill gaps and generates step-by-step learning schedules.
 */
export const queryLearningAgent = async (userId, targetGoal) => {
  // Retrieve the digital twin
  const twin = await DigitalTwin.findOne({ userId });
  
  const skills = twin ? twin.skills.join(', ') : 'Not defined yet';
  const interests = twin ? twin.interests.join(', ') : 'Not defined yet';
  const strengths = twin ? twin.strengths.join(', ') : 'Not defined yet';
  const weaknesses = twin ? twin.weaknesses.join(', ') : 'Not defined yet';

  const systemPrompt = `You are the Learning Agent of SecondMind. 
The user wants to achieve this goal: "${targetGoal}"
Here is the user's current Digital Twin profile:
- Current Skills: ${skills}
- Interests: ${interests}
- Strengths: ${strengths}
- Weaknesses: ${weaknesses}

Create a structured study and resource plan to achieve this goal. You MUST return your response as a valid JSON object matching this schema exactly:
{
  "milestones": [
    {
      "title": "Milestone Title",
      "timeframe": "Suggested timeframe (e.g. Weeks 1-2)",
      "resources": "Recommended books, courses, or resource types",
      "details": "Explanation of what to study and practice"
    }
  ],
  "skillRoadmap": ["Skill to acquire 1", "Skill to acquire 2"],
  "estimatedOutcomes": "A brief summary of what the user will achieve"
}
Do not return any conversational text outside of the JSON block.`;

  const jsonText = await queryModel(systemPrompt, true);
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('Failed to parse Learning Agent JSON response:', jsonText);
    throw new Error('Learning Agent output format was invalid.');
  }
};

/**
 * Career Agent: Simulates career projections and path switch strategies.
 */
export const queryCareerAgent = async (userId, targetCareerPath) => {
  const twin = await DigitalTwin.findOne({ userId });
  
  const skills = twin ? twin.skills.join(', ') : 'Not defined yet';
  const goals = twin ? twin.goals.join(', ') : 'Not defined yet';
  const interests = twin ? twin.interests.join(', ') : 'Not defined yet';

  const systemPrompt = `You are the Career Agent of SecondMind. 
The user is simulating this career progression or change: "${targetCareerPath}"
Here is the user's current Digital Twin profile:
- Skills: ${skills}
- Goals: ${goals}
- Interests: ${interests}

Project the future career trajectory. Provide structured feedback. You MUST return your response as a valid JSON object matching this schema:
{
  "timeline": [
    {
      "phase": "Phase Name (e.g. Month 1-3: Foundation)",
      "role": "Expected job role / status",
      "milestones": ["Key milestone 1", "Key milestone 2"],
      "riskLevel": "Low/Medium/High"
    }
  ],
  "gapAnalysis": ["Missing skill 1", "Missing skill 2"],
  "progressionProbability": "Estimated likelihood of success (e.g. 75%) with reasoning"
}
Do not return any conversational text outside of the JSON block.`;

  const jsonText = await queryModel(systemPrompt, true);
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('Failed to parse Career Agent JSON response:', jsonText);
    throw new Error('Career Agent output format was invalid.');
  }
};

/**
 * Planning Agent: Generates action-oriented schedules and tracks roadmaps.
 */
export const queryPlanningAgent = async (userId) => {
  const twin = await DigitalTwin.findOne({ userId });
  const recentMemories = await Memory.find({ userId }).sort({ createdAt: -1 }).limit(10);
  
  const skills = twin ? twin.skills.join(', ') : 'Not defined yet';
  const goals = twin ? twin.goals.join(', ') : 'Not defined yet';
  const summaries = recentMemories.map(m => `- ${m.summary || m.content.substring(0, 100)}`).join('\n');

  const systemPrompt = `You are the Planning Agent of SecondMind. 
Your task is to take the user's Digital Twin details and recent activities to construct a weekly micro-plan.
User Profile:
- Skills: ${skills}
- Core Goals: ${goals}

Recent User Activities/Memories:
${summaries || 'No recent activity recorded.'}

Generate a detailed weekly schedule that allocates study/work blocks targeting the user's goals. You MUST return your response as a valid JSON object matching this schema:
{
  "weeklyFocus": "The main objective for the week",
  "schedule": [
    {
      "day": "Monday",
      "tasks": [
        {
          "time": "e.g. Morning",
          "activity": "Activity description",
          "linkToGoal": "Which core goal this task helps progress"
        }
      ]
    }
  ],
  "actionItems": ["Immediate action item 1", "Immediate action item 2"]
}
Do not return any conversational text outside of the JSON block.`;

  const jsonText = await queryModel(systemPrompt, true);
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('Failed to parse Planning Agent JSON response:', jsonText);
    throw new Error('Planning Agent output format was invalid.');
  }
};
