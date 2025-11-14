require('dotenv').config();
const axios = require('axios');

// Test Agora Conversational AI API
async function testAgoraAPI() {
  console.log('🧪 Testing Agora Conversational AI API...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('AGORA_APP_ID:', process.env.AGORA_APP_ID ? '✅ Set' : '❌ Missing');
  console.log('AGORA_CUSTOMER_ID:', process.env.AGORA_CUSTOMER_ID ? '✅ Set' : '❌ Missing');
  console.log('AGORA_CUSTOMER_SECRET:', process.env.AGORA_CUSTOMER_SECRET ? '✅ Set' : '❌ Missing');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('');

  // Generate Basic Auth
  const credentials = `${process.env.AGORA_CUSTOMER_ID}:${process.env.AGORA_CUSTOMER_SECRET}`;
  const authHeader = `Basic ${Buffer.from(credentials).toString('base64')}`;

  // Test payload with correct Gemini model
  const testPayload = {
    name: `test_agent_${Date.now()}`,
    properties: {
      channel: `test_channel_${Date.now()}`,
      token: 'test_token', // Will be replaced with real token
      agent_rtc_uid: '999',
      remote_rtc_uids: ['*'],
      enable_string_uid: false,
      idle_timeout: 300,
      llm: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
        system_messages: [
          {
            parts: [{ text: 'You are a helpful study assistant.' }],
            role: 'user',
          },
        ],
        max_history: 32,
        greeting_message: 'Hello! How can I help you?',
        failure_message: 'Sorry, I didn\'t catch that.',
        params: {
          model: 'gemini-2.0-flash-exp',
        },
        style: 'gemini',
        ignore_empty: true,
      },
      asr: {
        vendor: 'ares',
        language: 'en-US',
      },
      tts: {
        vendor: 'elevenlabs',
        params: {
          key: process.env.ELEVENLABS_API_KEY,
          model_id: process.env.ELEVENLABS_MODEL_ID,
          voice_id: process.env.ELEVENLABS_VOICE_ID,
          sample_rate: 24000,
          speed: 1.0,
        },
      },
    },
  };

  console.log('📤 Testing Agora API endpoint...');
  console.log('URL:', `${process.env.AGORA_API_BASE_URL}/projects/${process.env.AGORA_APP_ID}/join`);
  console.log('');

  try {
    const response = await axios.post(
      `${process.env.AGORA_API_BASE_URL}/projects/${process.env.AGORA_APP_ID}/join`,
      testPayload,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ SUCCESS! Agent created:');
    console.log('Agent ID:', response.data.agent_id);
    console.log('Status:', response.data.status);
    console.log('Created at:', new Date(response.data.create_ts * 1000).toISOString());
    console.log('');

    // Stop the agent
    console.log('🛑 Stopping test agent...');
    await axios.post(
      `${process.env.AGORA_API_BASE_URL}/projects/${process.env.AGORA_APP_ID}/agents/${response.data.agent_id}/leave`,
      {},
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Agent stopped successfully');

  } catch (error) {
    console.error('❌ ERROR:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Message:', error.message);
    }
  }
}

// Test Gemini API
async function testGeminiAPI() {
  console.log('\n🧪 Testing Gemini API...\n');

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: 'Say hello in one word' }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Gemini API working!');
    console.log('Response:', response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('❌ Gemini API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.error?.message || error.message);
  }
}

// Test ElevenLabs API
async function testElevenLabsAPI() {
  console.log('\n🧪 Testing ElevenLabs API...\n');

  try {
    const response = await axios.get(
      'https://api.elevenlabs.io/v1/voices',
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        }
      }
    );

    console.log('✅ ElevenLabs API working!');
    console.log('Available voices:', response.data.voices.length);
    
    // Check if configured voice exists
    const voice = response.data.voices.find(v => v.voice_id === process.env.ELEVENLABS_VOICE_ID);
    if (voice) {
      console.log('✅ Configured voice found:', voice.name);
    } else {
      console.log('⚠️  Configured voice ID not found');
    }
  } catch (error) {
    console.error('❌ ElevenLabs API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.detail?.message || error.message);
  }
}

// Run all tests
async function runTests() {
  await testGeminiAPI();
  await testElevenLabsAPI();
  await testAgoraAPI();
}

runTests();
