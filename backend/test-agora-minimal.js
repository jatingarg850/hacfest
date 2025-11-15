require('dotenv').config();
const axios = require('axios');
const { getAgoraAuthHeader, generateRtcToken } = require('./src/config/agora');

async function testMinimalAgent() {
  console.log('Testing minimal Agora agent configuration...');
  
  const appId = process.env.AGORA_APP_ID;
  const channelName = `test_${Date.now()}`;
  const agentUid = 999;
  const token = generateRtcToken(channelName, agentUid);
  
  const url = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/join`;
  
  // Absolute minimal configuration from Agora docs
  const payload = {
    name: `test_agent_${Date.now()}`,
    properties: {
      channel: channelName,
      token: token,
      agent_rtc_uid: agentUid.toString(),
      remote_rtc_uids: ['*'],
      enable_string_uid: false,
      idle_timeout: 120,
      llm: {
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
        system_messages: [
          {
            parts: [{ text: 'You are a helpful chatbot' }],
            role: 'user',
          },
        ],
        greeting_message: 'Hello',
        failure_message: 'Sorry',
        max_history: 10,
        params: {
          model: 'gemini-2.0-flash',
        },
        style: 'gemini',
      },
      asr: {
        vendor: 'ares',
        language: 'en-US',
      },
      tts: {
        vendor: 'elevenlabs',
        params: {
          key: process.env.ELEVENLABS_API_KEY,
          model_id: 'eleven_flash_v2_5',
          voice_id: 'pNInz6obpgDQGcFmaJgB',
          sample_rate: 24000,
        },
      },
    },
  };
  
  try {
    console.log('\n📤 Sending request...');
    console.log('Channel:', channelName);
    console.log('Agent UID:', agentUid);
    
    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': getAgoraAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    console.log('\n✅ Agent created!');
    console.log('Agent ID:', response.data.agent_id);
    console.log('Status:', response.data.status);
    console.log('\n📊 Full response:', JSON.stringify(response.data, null, 2));
    
    // Query status after 5 seconds
    setTimeout(async () => {
      try {
        const statusUrl = `https://api.agora.io/api/conversational-ai-agent/v2/projects/${appId}/agents/${response.data.agent_id}`;
        const statusResponse = await axios.get(statusUrl, {
          headers: {
            'Authorization': getAgoraAuthHeader(),
          },
        });
        
        console.log('\n📊 Agent Status (5s):', JSON.stringify(statusResponse.data, null, 2));
        
        if (statusResponse.data.status === 'RUNNING') {
          console.log('\n✅ Agent is RUNNING');
          console.log('\n🔍 DIAGNOSIS:');
          console.log('   - Agent starts: ✅');
          console.log('   - Agent joins channel: ✅');
          console.log('   - Agent audio publishing: ❓ (check Flutter logs)');
          console.log('\nIf Flutter shows "remoteAudioReasonRemoteMuted", this is an Agora API issue.');
          console.log('The agent is not publishing audio to the RTC channel.');
        }
      } catch (error) {
        console.error('\n❌ Status query failed:', error.message);
      }
    }, 5000);
    
  } catch (error) {
    console.error('\n❌ Failed to create agent:');
    console.error('Status:', error.response?.status);
    console.error('Error:', JSON.stringify(error.response?.data, null, 2));
  }
}

testMinimalAgent();
