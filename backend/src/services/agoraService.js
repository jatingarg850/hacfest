const axios = require('axios');
const { agoraConfig, getAgoraAuthHeader, generateRtcToken } = require('../config/agora');

class AgoraService {
  constructor() {
    this.baseUrl = agoraConfig.apiBaseUrl;
    this.appId = agoraConfig.appId;
  }

  // Start conversational AI agent
  async startAgent(channelName, userId, systemPrompt) {
    console.log('🎙️ Starting Agora AI agent...');
    console.log('Channel:', channelName);
    console.log('User ID:', userId);
    
    const agentUid = 999; // Fixed UID for agent
    const token = generateRtcToken(channelName, agentUid);

    const url = `${this.baseUrl}/projects/${this.appId}/join`;
    console.log('API URL:', url);
    
    const payload = {
      name: `agent_${userId}_${Date.now()}`,
      properties: {
        channel: channelName,
        token: token,
        agent_rtc_uid: agentUid.toString(),
        remote_rtc_uids: ['*'],
        enable_string_uid: false,
        idle_timeout: 300, // 5 minutes
        enable_greeting: true,
        llm: {
          url: `${process.env.PROXY_SERVER_URL || 'http://localhost:3001'}/v1/chat/completions`,
          system_messages: [
            {
              role: 'system',
              content: systemPrompt || 'You are a helpful study assistant chatbot.'
            },
          ],
          max_history: 10,
          greeting_message: 'Hello! How can I help you study today?',
          failure_message: 'Sorry, I did not catch that. Could you please repeat?',
          params: {
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            max_tokens: 150,
          },
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

    try {
      console.log('📤 Sending request to Agora...');
      console.log('📋 Agent Configuration:');
      console.log('  - Channel:', channelName);
      console.log('  - Agent UID:', agentUid);
      console.log('  - Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('  - App ID:', this.appId);
      console.log('  - ASR: ARES (en-US)');
      console.log('  - LLM: Gemini 1.5 Flash (streaming)');
      console.log('  - TTS: ElevenLabs (Sarah)');
      console.log('  - Greeting:', payload.properties.llm.greeting_message);
      console.log('📦 Full payload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': getAgoraAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Agent created successfully!');
      console.log('Agent ID:', response.data.agent_id);
      console.log('Status:', response.data.status);
      console.log('⏳ Agent is now listening for user speech...');
      console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('❌ Agora start agent error:');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Message:', error.message);
      
      // Return more detailed error
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      throw new Error(`Failed to start AI agent: ${errorMessage}`);
    }
  }

  // Stop conversational AI agent
  async stopAgent(agentId) {
    const url = `${this.baseUrl}/projects/${this.appId}/agents/${agentId}/leave`;

    try {
      const response = await axios.post(url, {}, {
        headers: {
          'Authorization': getAgoraAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Agora stop agent error:', error.response?.data || error.message);
      throw new Error('Failed to stop AI agent');
    }
  }

  // Query agent status
  async queryAgent(agentId) {
    const url = `${this.baseUrl}/projects/${this.appId}/agents/${agentId}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': getAgoraAuthHeader(),
        },
      });

      return response.data;
    } catch (error) {
      console.error('Agora query agent error:', error.response?.data || error.message);
      throw new Error('Failed to query AI agent');
    }
  }

  // Generate RTC token for user
  generateUserToken(channelName, userId) {
    return generateRtcToken(channelName, userId);
  }
}

module.exports = new AgoraService();
