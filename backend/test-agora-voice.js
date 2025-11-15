require('dotenv').config();
const agoraService = require('./src/services/agoraService');

async function testAgoraVoice() {
  console.log('🧪 Testing Agora Voice AI Agent...');
  console.log('');
  console.log('Configuration:');
  console.log('  - Agora App ID:', process.env.AGORA_APP_ID ? 'Present ✓' : 'Missing ✗');
  console.log('  - Agora Certificate:', process.env.AGORA_APP_CERTIFICATE ? 'Present ✓' : 'Missing ✗');
  console.log('  - Agora Customer ID:', process.env.AGORA_CUSTOMER_ID ? 'Present ✓' : 'Missing ✗');
  console.log('  - Agora Customer Secret:', process.env.AGORA_CUSTOMER_SECRET ? 'Present ✓' : 'Missing ✗');
  console.log('  - Gemini API Key:', process.env.GEMINI_API_KEY ? 'Present ✓' : 'Missing ✗');
  console.log('  - ElevenLabs API Key:', process.env.ELEVENLABS_API_KEY ? 'Present ✓' : 'Missing ✗');
  console.log('  - ElevenLabs Voice ID:', process.env.ELEVENLABS_VOICE_ID);
  console.log('');
  
  const channelName = `test_channel_${Date.now()}`;
  const userId = 'test_user_123';
  const systemPrompt = 'You are a helpful voice assistant. Keep responses very brief.';
  
  try {
    console.log('🚀 Starting AI agent...');
    const agentResponse = await agoraService.startAgent(channelName, userId, systemPrompt);
    
    console.log('');
    console.log('✅ Agent started successfully!');
    console.log('Agent ID:', agentResponse.agent_id);
    console.log('Status:', agentResponse.status);
    console.log('');
    console.log('⏳ Waiting 5 seconds for agent to initialize...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('');
    console.log('📊 Querying agent status...');
    const statusResponse = await agoraService.queryAgent(agentResponse.agent_id);
    console.log('Agent Status:', JSON.stringify(statusResponse, null, 2));
    
    console.log('');
    console.log('🛑 Stopping agent...');
    await agoraService.stopAgent(agentResponse.agent_id);
    console.log('✅ Agent stopped successfully!');
    
    console.log('');
    console.log('✅ All tests passed! Voice AI is configured correctly.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Run your Flutter app');
    console.log('3. Try the voice chat feature');
    
  } catch (error) {
    console.error('');
    console.error('❌ Test failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check all API keys are valid');
    console.error('2. Verify Agora credentials are correct');
    console.error('3. Ensure you have Agora Conversational AI enabled');
    console.error('4. Check network connectivity');
  }
}

testAgoraVoice();
