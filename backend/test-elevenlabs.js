require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function testElevenLabs() {
  console.log('🧪 Testing ElevenLabs TTS...');
  console.log('API Key:', process.env.ELEVENLABS_API_KEY ? 'Present ✓' : 'Missing ✗');
  console.log('Voice ID:', process.env.ELEVENLABS_VOICE_ID);
  console.log('Model ID:', process.env.ELEVENLABS_MODEL_ID);
  
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
  
  const payload = {
    text: 'Hello! This is a test of the text to speech system.',
    model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_flash_v2_5',
  };
  
  try {
    console.log('📤 Sending test request to ElevenLabs...');
    
    const response = await axios.post(url, payload, {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ ElevenLabs TTS Response received!');
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Audio size:', response.data.length, 'bytes');
    
    // Save audio file
    fs.writeFileSync('test-elevenlabs-output.mp3', response.data);
    console.log('✅ Audio saved to test-elevenlabs-output.mp3');
    console.log('\n✅ ElevenLabs TTS is working correctly!');
  } catch (error) {
    console.error('❌ ElevenLabs TTS Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data?.toString());
    console.error('Message:', error.message);
  }
}

testElevenLabs();
