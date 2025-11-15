require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

let lastLogCount = 0;

async function monitorConversation(sessionId) {
  console.log('🎧 Conversation Monitor');
  console.log('======================\n');
  console.log(`Monitoring session: ${sessionId}`);
  console.log('Press Ctrl+C to stop\n');
  console.log('Waiting for conversation...\n');
  
  const interval = setInterval(async () => {
    try {
      const response = await axios.get(`${API_BASE}/monitoring/sessions/${sessionId}/logs`);
      const logs = response.data.logs;
      
      // Only show new logs
      if (logs.length > lastLogCount) {
        const newLogs = logs.slice(lastLogCount);
        newLogs.forEach(log => {
          const time = new Date(log.timestamp).toLocaleTimeString();
          const emoji = log.type === 'user' ? '👤 USER' : '🤖 AI';
          console.log(`[${time}] ${emoji}: ${log.content}`);
        });
        lastLogCount = logs.length;
      }
    } catch (error) {
      // Session might not exist yet
    }
  }, 1000); // Check every second
  
  // Cleanup on exit
  process.on('SIGINT', () => {
    clearInterval(interval);
    console.log('\n\n👋 Monitoring stopped');
    process.exit(0);
  });
}

// Get session ID from command line or use latest
const sessionId = process.argv[2];

if (sessionId) {
  monitorConversation(sessionId);
} else {
  console.log('Usage: node monitor-conversation.js <session_id>');
  console.log('\nOr start a voice session in the app and check backend logs for session ID');
  process.exit(1);
}
