const express = require('express');
const router = express.Router();
const VoiceSession = require('../models/VoiceSession');

// Store conversation logs in memory (for demo purposes)
const conversationLogs = new Map();

// Add a conversation log entry
function logConversation(sessionId, type, content) {
  if (!conversationLogs.has(sessionId)) {
    conversationLogs.set(sessionId, []);
  }
  
  const entry = {
    timestamp: new Date(),
    type, // 'user' or 'agent'
    content
  };
  
  conversationLogs.get(sessionId).push(entry);
  
  // Log to console
  const emoji = type === 'user' ? '👤' : '🤖';
  console.log(`${emoji} [${sessionId}] ${type.toUpperCase()}: ${content}`);
  
  return entry;
}

// Get conversation logs for a session
router.get('/sessions/:sessionId/logs', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const logs = conversationLogs.get(sessionId) || [];
    
    res.json({
      sessionId,
      logs,
      count: logs.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all active sessions
router.get('/sessions/active', async (req, res) => {
  try {
    const sessions = await VoiceSession.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear logs for a session
router.delete('/sessions/:sessionId/logs', (req, res) => {
  const { sessionId } = req.params;
  conversationLogs.delete(sessionId);
  res.json({ message: 'Logs cleared' });
});

module.exports = { router, logConversation };
