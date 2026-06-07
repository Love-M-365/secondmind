import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Google Gemini AI Service Initialized Successfully.');
  } catch (error) {
    console.error('Error initializing Gemini Client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY or GOOGLE_API_KEY is missing in environment.');
  console.warn('>>> RUNNING IN MOCK GEMINI AI MODE <<<');
}

export const queryModel = async (prompt, jsonMode = false) => {
  if (!genAI) {
    return generateMockResponse(prompt, jsonMode);
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const requestConfig = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    };

    if (jsonMode) {
      requestConfig.generationConfig = {
        responseMimeType: 'application/json'
      };
    }

    const result = await model.generateContent(requestConfig);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error('Gemini API query failed:', error);
    if (!apiKey) {
      return generateMockResponse(prompt, jsonMode);
    }
    throw error;
  }
};

export const generateSummary = async (content) => {
  const prompt = `You are a cognitive memory system. Summarize the following user-provided text in 2-3 concise sentences. Focus strictly on key takeaways, professional facts, or personal thoughts mentioned.\n\nText:\n${content.substring(0, 15000)}`;
  
  try {
    const summary = await queryModel(prompt, false);
    return summary.trim();
  } catch (err) {
    console.error('Failed to generate summary, falling back to substring:', err);
    return content.substring(0, 200).trim() + '...';
  }
};

export const generateMockResponse = async (prompt, jsonMode) => {
  // Simple heuristics to respond intelligently in mock mode
  console.log('[MOCK GEMINI] Query received');
  
  if (jsonMode) {
    if (prompt.includes('Digital Twin') || prompt.includes('skills')) {
      return JSON.stringify({
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Javascript', 'REST APIs', 'System Architecture'],
        interests: ['Artificial Intelligence', 'Full Stack Engineering', 'Cloud Platforms', 'Knowledge Graphs'],
        goals: ['Become an AI Engineer', 'Launch a production SaaS project', 'Master machine learning frameworks'],
        strengths: ['Analytical thinking', 'Fast code implementation', 'Component abstraction'],
        weaknesses: ['DevOps automation', 'Deep neural network fine-tuning']
      });
    }
    if (prompt.includes('milestones') || prompt.includes('roadmap') || prompt.includes('Future Simulation')) {
      return JSON.stringify({
        milestones: [
          { title: 'Learn Neural Network Foundations', timeframe: 'Month 1-3', resources: 'Deep Learning Specialization (Coursera), PyTorch Tutorials', details: 'Focus on backpropagation, activation functions, and basic MLP construction.' },
          { title: 'Build NLP and LLM Fine-Tuning Demos', timeframe: 'Month 4-6', resources: 'Hugging Face Course, Gemini SDK Documentation', details: 'Learn prompt engineering, vector database retrieval, and LoRA/QLoRA adapter fine-tuning.' },
          { title: 'Architect Production AI Application', timeframe: 'Month 7-12', resources: 'Google Cloud Run, MongoDB Vector Search guide', details: 'Integrate real-time memory synchronization, agent tool-calling, and deploy via serverless workflows.' }
        ],
        skillRoadmap: ['Python', 'PyTorch', 'Transformers', 'Vector Databases', 'Google Cloud Run', 'LangChain/LlamaIndex'],
        estimatedOutcomes: 'Transition from general Full Stack developer to a competent AI Systems Engineer capable of structuring agentic memory pipelines.'
      });
    }
  }

  // Plain Text Responses based on contents
  if (prompt.includes('projects') || prompt.includes('What projects')) {
    return "Based on your memories, you have worked on a modern Expense Tracker ('Xpense') using React and Node.js, and you are currently building 'SecondMind', a comprehensive cognitive digital twin memory platform.";
  }
  if (prompt.includes('skills') || prompt.includes('strongest')) {
    return "You exhibit strong expertise in Full Stack Engineering, specifically React, Node.js, Express, and database management with MongoDB. You are actively growing your knowledge in AI engineering and Google Cloud integration.";
  }
  
  return `[Mock AI Response] Grounded answer generated for query. Based on your memory corpus, you set goals focused on AI engineering, cloud deployment, and SaaS development. Continue building projects to bridge your DevOps skill gaps.`;
};
