require('dotenv').config();
const axios = require('axios');

async function testGemini() {
  console.log('Testing Gemini API...');
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;
  
  try {
    const response = await axios.post(
      url,
      {
        contents: [
          {
            parts: [{ text: 'Say hello in one word' }],
            role: 'user',
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('✅ Gemini API working!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Gemini API error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    return false;
  }
}

testGemini();
