require('dotenv').config();
const agoraService = require('./src/services/agoraService');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let agentId = null;
let monitorInterval = null;

async function startMonitoring() {
  console.log('🎙️ Voice Session Monitor');
  console.log('========================\n');
  
  const channelName = `monitor_${Date.now()}`;
  const userId = 'monitor_user';
  
  try {
    console.log('🚀 Starting agent...');
    const response = await agoraService.startAgent(
      channelName, 
      userId, 
      'You are a helpful assistant. Keep responses brief.'
    );
    
    agentId = response.agent_id;
    console.log('\n✅ Agent started!');
    console.log('Agent ID:', agentId);
    console.log('Channel:', channelName);
    console.log('\n📊 Monitoring agent status every 5 seconds...');
    console.log('Press Ctrl+C to stop\n');
    
    // Monitor status every 5 seconds
    monitorInterval = setInterval(async () => {
      try {
        const status = await agoraService.queryAgent(agentId);
        const timestamp = new Date().toLocaleTimeString();
        
        console.log(`[${timestamp}] Status: ${status.status} | Message: ${status.message || 'ok'}`);
        
        if (status.status !== 'RUNNING') {
          console.log('⚠️  Agent is not running!');
          clearInterval(monitorInterval);
        }
      } catch (error) {
        console.error('❌ Error querying status:', error.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Failed to start agent:', error.message);
    process.exit(1);
  }
}

async function cleanup() {
  console.log('\n\n🛑 Stopping agent...');
  
  if (monitorInterval) {
    clearInterval(monitorInterval);
  }
  
  if (agentId) {
    try {
      await agoraService.stopAgent(agentId);
      console.log('✅ Agent stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping agent:', error.message);
    }
  }
  
  process.exit(0);
}

// Handle Ctrl+C
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start monitoring
startMonitoring();
