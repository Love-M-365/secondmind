import { queryLearningAgent, queryCareerAgent, queryPlanningAgent } from '../services/agents/agent.service.js';

export const simulateFuture = async (req, res) => {
  try {
    const { goal } = req.body;
    if (!goal) {
      return res.status(400).json({ success: false, message: 'Simulation goal/pathway is required' });
    }

    console.log(`[Simulation Engine] Simulating target path: "${goal}" for user: ${req.user.email}`);

    // Run Career Agent and Learning Agent simulations concurrently
    const [careerSimulation, learningSimulation] = await Promise.all([
      queryCareerAgent(req.user._id, goal),
      queryLearningAgent(req.user._id, goal)
    ]);

    res.status(200).json({
      success: true,
      goal,
      career: careerSimulation,
      learning: learningSimulation,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Simulation Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeeklyPlan = async (req, res) => {
  try {
    console.log(`[Planning Agent] Generating weekly plan for user: ${req.user.email}`);
    const weeklyPlan = await queryPlanningAgent(req.user._id);

    res.status(200).json({
      success: true,
      plan: weeklyPlan,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Planning Controller Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
