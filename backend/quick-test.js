#!/usr/bin/env node
require('dotenv').config();

const tests = [
  {
    name: 'Environment Variables',
    test: () => {
      const required = [
        'AGORA_APP_ID',
        'AGORA_APP_CERTIFICATE',
        'AGORA_CUSTOMER_ID',
        'AGORA_CUSTOMER_SECRET',
        'GEMINI_API_KEY',
        'ELEVENLABS_API_KEY',
        'ELEVENLABS_VOICE_ID'
      ];
      
      const missing = required.filter(key => !process.env[key]);
      
      if (missing.length > 0) {
        throw new Error(`Missing: ${missing.join(', ')}`);
      }
      
      return 'All required environment variables present';
    }
  },
  {
    name: 'Gemini API',
    test: async () => {
      const axios = require('axios');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;
      
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: 'Say hi' }], role: 'user' }],
        generationConfig: { maxOutputTokens: 10 }
      }, { timeout: 10000 });
      
      if (response.status === 200) {
        return 'Gemini API responding correctly';
      }
      throw new Error('Unexpected response');
    }
  },
  {
    name: 'ElevenLabs TTS',
    test: async () => {
      const axios = require('axios');
      const url = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
      
      const response = await axios.post(url, {
        text: 'Test',
        model_id: 'eleven_flash_v2_5'
      }, {
        headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      if (response.status === 200 && response.data.length > 0) {
        return `TTS working (${response.data.length} bytes audio)`;
      }
      throw new Error('No audio generated');
    }
  },
  {
    name: 'Agora Agent',
    test: async () => {
      const agoraService = require('./src/services/agoraService');
      const channelName = `test_${Date.now()}`;
      
      const response = await agoraService.startAgent(
        channelName,
        'test_user',
        'Test prompt'
      );
      
      if (response.agent_id && response.status === 'RUNNING') {
        // Clean up
        await agoraService.stopAgent(response.agent_id);
        return `Agent started successfully (${response.agent_id})`;
      }
      throw new Error('Agent failed to start');
    }
  }
];

async function runTests() {
  console.log('🧪 Quick Voice AI Test Suite\n');
  console.log('═'.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const { name, test } of tests) {
    process.stdout.write(`\n${name}... `);
    
    try {
      const result = await test();
      console.log('✅');
      console.log(`   ${result}`);
      passed++;
    } catch (error) {
      console.log('❌');
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n✅ All tests passed! Voice AI is ready to use.');
    console.log('\nNext steps:');
    console.log('1. npm start (in backend directory)');
    console.log('2. flutter run (in flutter_app directory)');
    console.log('3. Tap the microphone button and start talking!');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
    console.log('\nTroubleshooting:');
    console.log('- Verify all API keys in .env file');
    console.log('- Check network connectivity');
    console.log('- See VOICE_TROUBLESHOOTING_GUIDE.md for details');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  process.exit(1);
});
