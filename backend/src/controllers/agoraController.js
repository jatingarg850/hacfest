const agoraService = require('../services/agoraService');
const VoiceSession = require('../models/VoiceSession');
const User = require('../models/User');

// Start voice session with AI agent
exports.startVoiceSession = async (req, res) => {
  try {
    const { currentPage = 'home' } = req.body;
    const userId = req.userId;

    // Generate unique channel name
    const channelName = `study_ai_${userId}_${Date.now()}`;

    // Get user info for personalized prompt
    const user = await User.findById(userId).populate('studyPlan');
    
    // Create system prompt based on context
    const systemPrompt = generateSystemPrompt(user, currentPage);

    // Start Agora AI agent
    const agentResponse = await agoraService.startAgent(channelName, userId, systemPrompt);

    // Generate user token with a simple UID (0 means Agora will assign one)
    const userUid = 0; // Let Agora assign UID automatically
    const userToken = agoraService.generateUserToken(channelName, userUid);
    
    console.log('🎫 Generated token for user');
    console.log('Channel:', channelName);
    console.log('User UID:', userUid);

    // Create voice session record
    const session = new VoiceSession({
      userId,
      channelName,
      agentId: agentResponse.agent_id,
      status: 'active',
    });
    await session.save();

    res.json({
      sessionId: session._id,
      channelName,
      userToken,
      agentId: agentResponse.agent_id,
      appId: process.env.AGORA_APP_ID,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Stop voice session
exports.stopVoiceSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await VoiceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Stop Agora agent
    if (session.agentId) {
      await agoraService.stopAgent(session.agentId);
    }

    // Update session
    session.status = 'ended';
    session.endedAt = new Date();
    await session.save();

    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get session details
exports.getSession = async (req, res) => {
  try {
    const session = await VoiceSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Query agent status
exports.queryAgentStatus = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agentStatus = await agoraService.queryAgent(agentId);
    res.json({ agent: agentStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate system prompt
function generateSystemPrompt(user, currentPage) {
  // CRITICAL: Keep prompt VERY brief for fast TTS triggering
  return `You are a voice-first study assistant for ${user.name}. Current page: ${currentPage}. Intents: open quiz, open flashcards, open news, open community, search, back. When intent is clear, emit a JSON tool call first, then say a short confirmation. Keep all answers under 20 words.`;
}
