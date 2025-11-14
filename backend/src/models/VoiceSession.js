const mongoose = require('mongoose');

const voiceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  agentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active',
  },
  conversationHistory: [{
    role: String,
    content: String,
    timestamp: Date,
  }],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: Date,
});

module.exports = mongoose.model('VoiceSession', voiceSessionSchema);
