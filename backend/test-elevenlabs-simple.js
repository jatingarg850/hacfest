require('dotenv').config();
const axios = require('axios');

async function testElevenLabs() {
  console.log('Testing ElevenLabs API...');
  console.log('Voice ID:', process.env.ELEVENLABS_VOICE_ID);
  
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        text: 'Hello, this is a test.',
        model_id: 'eleven_flash_v2_5',
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    
    console.log('✅ ElevenLabs API working!');
    console.log('Audio size:', response.data.length, 'bytes');
    return true;
  } catch (error) {
    console.error('❌ ElevenLabs API error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data?.toString());
    return false;
  }
}

testElevenLabs();
