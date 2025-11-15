require('dotenv').config();
const axios = require('axios');

async function testGemini() {
  console.log('🧪 Testing Gemini API...');
  console.log('API Key:', process.env.GEMINI_API_KEY ? 'Present ✓' : 'Missing ✗');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: 'Say hello in one sentence.'
          }
        ],
        role: 'user'
      }
    ],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 100,
    }
  };
  
  try {
    console.log('📤 Sending test request to Gemini...');
    console.log('URL:', url.replace(process.env.GEMINI_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text'
    });
    
    console.log('✅ Gemini API Response:');
    console.log(response.data);
    console.log('\n✅ Gemini API is working correctly!');
  } catch (error) {
    console.error('❌ Gemini API Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testGemini();
