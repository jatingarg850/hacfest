require('dotenv').config();
const axios = require('axios');

// Simple test to verify voice AI is working
async function testVoiceAI() {
  console.log('🧪 Testing Voice AI Configuration...\n');

  const baseUrl = 'http://localhost:3000/api';
  
  // 1. Login
  console.log('1️⃣ Logging in...');
  const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
    email: 'test@example.com',
    password: 'test123'
  });
  
  const token = loginResponse.data.token;
  console.log('✅ Logged in\n');

  // 2. Start voice session
  console.log('2️⃣ Starting voice session...');
  const voiceResponse = await axios.post(
    `${baseUrl}/voice/start`,
    { currentPage: 'home' },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  console.log('✅ Voice session started');
  console.log('Channel:', voiceResponse.data.channelName);
  console.log('Agent ID:', voiceResponse.data.agentId);
  console.log('Session ID:', voiceResponse.data.sessionId);
  console.log('\n⏳ Waiting 10 seconds for agent to initialize...\n');
  
  // Wait for agent to be ready
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // 3. Query agent status
  console.log('3️⃣ Checking agent status...');
  const agentId = voiceResponse.data.agentId;
  
  try {
    const statusResponse = await axios.get(
      `https://api.agora.io/api/conversational-ai-agent/v2/projects/${process.env.AGORA_APP_ID}/agents/${agentId}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`).toString('base64')}`
        }
      }
    );
    
    console.log('✅ Agent Status:', statusResponse.data.status);
    console.log('Agent Details:', JSON.stringify(statusResponse.data, null, 2));
  } catch (error) {
    console.log('❌ Error checking status:', error.response?.data);
  }
  
  console.log('\n4️⃣ Stopping voice session...');
  
  // 4. Stop session
  await axios.post(
    `${baseUrl}/voice/stop`,
    { sessionId: voiceResponse.data.sessionId },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  console.log('✅ Session stopped\n');
  console.log('✅ Test complete!');
}

testVoiceAI().catch(error => {
  console.error('❌ Test failed:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
});
