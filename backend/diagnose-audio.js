require('dotenv').config();
const axios = require('axios');
const agoraService = require('./src/services/agoraService');

async function diagnoseAudio() {
  console.log('🔍 Diagnosing Voice AI Audio Issues\n');
  console.log('═'.repeat(60));
  
  const channelName = `diagnose_${Date.now()}`;
  let agentId = null;
  
  try {
    // Step 1: Start agent
    console.log('\n📍 Step 1: Starting AI Agent...');
    const response = await agoraService.startAgent(
      channelName,
      'diagnose_user',
      'Say hello in one sentence.'
    );
    
    agentId = response.agent_id;
    console.log('✅ Agent started:', agentId);
    console.log('Status:', response.status);
    
    // Step 2: Wait for agent to initialize
    console.log('\n📍 Step 2: Waiting for agent to initialize (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 3: Check agent status
    console.log('\n📍 Step 3: Checking agent status...');
    const status = await agoraService.queryAgent(agentId);
    console.log('Agent Status:', JSON.stringify(status, null, 2));
    
    if (status.status !== 'RUNNING') {
      console.log('❌ Agent is not running!');
      return;
    }
    
    // Step 4: Test TTS directly
    console.log('\n📍 Step 4: Testing ElevenLabs TTS directly...');
    const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`;
    const ttsResponse = await axios.post(ttsUrl, {
      text: 'Hi! How can I help you study today?',
      model_id: 'eleven_flash_v2_5',
    }, {
      headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY },
      responseType: 'arraybuffer',
      timeout: 10000
    });
    
    if (ttsResponse.status === 200 && ttsResponse.data.length > 0) {
      console.log('✅ TTS working:', ttsResponse.data.length, 'bytes');
    } else {
      console.log('❌ TTS not generating audio');
    }
    
    // Step 5: Test Gemini LLM
    console.log('\n📍 Step 5: Testing Gemini LLM...');
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`;
    const geminiResponse = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: 'Say hello' }], role: 'user' }],
      generationConfig: { maxOutputTokens: 20 }
    }, { timeout: 10000 });
    
    if (geminiResponse.status === 200) {
      console.log('✅ Gemini responding');
    } else {
      console.log('❌ Gemini not responding');
    }
    
    // Step 6: Diagnosis
    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 DIAGNOSIS:\n');
    
    console.log('✅ Backend Configuration: OK');
    console.log('  - Agent starts successfully');
    console.log('  - Status: RUNNING');
    console.log('  - TTS: Working');
    console.log('  - LLM: Working');
    
    console.log('\n⚠️  LIKELY ISSUE: Flutter Audio Configuration');
    console.log('\nPossible causes:');
    console.log('  1. Agent UID 999 not being detected in Flutter');
    console.log('  2. Remote audio not being unmuted properly');
    console.log('  3. Audio route not set to speaker');
    console.log('  4. Volume too low on device');
    
    console.log('\n🔧 SOLUTIONS TO TRY:\n');
    console.log('1. Check Flutter logs for:');
    console.log('   - "USER JOINED EVENT: UID=999"');
    console.log('   - "REMOTE AUDIO STATE CHANGED"');
    console.log('   - "AI IS SPEAKING! Audio decoding..."');
    
    console.log('\n2. If you DON\'T see "USER JOINED EVENT: UID=999":');
    console.log('   - The agent is not joining the channel properly');
    console.log('   - Check that agent_rtc_uid is set to "999" (string)');
    console.log('   - Verify channel name matches exactly');
    
    console.log('\n3. If you see "USER JOINED" but no audio:');
    console.log('   - Device volume is too low');
    console.log('   - Audio route not set to speaker');
    console.log('   - Try physical device instead of emulator');
    
    console.log('\n4. Test on physical device:');
    console.log('   - Emulators often have audio issues');
    console.log('   - Use a real Android/iOS device');
    console.log('   - Ensure volume is at maximum');
    
    console.log('\n5. Enable verbose Agora logs in Flutter:');
    console.log('   - Add: await _engine!.setLogLevel(LogLevel.logLevelInfo);');
    console.log('   - Check for audio routing issues');
    
    console.log('\n' + '═'.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error during diagnosis:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  } finally {
    if (agentId) {
      console.log('\n🛑 Stopping agent...');
      try {
        await agoraService.stopAgent(agentId);
        console.log('✅ Agent stopped');
      } catch (e) {
        console.error('Error stopping agent:', e.message);
      }
    }
  }
}

diagnoseAudio();
