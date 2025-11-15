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
      name: `voice_nav_agent_${userId}_${Date.now()}`,
      properties: {
        channel: channelName,
        token: token,
        agent_rtc_uid: agentUid.toString(),
        remote_rtc_uids: ['*'],
        enable_string_uid: false,
        idle_timeout: 300,
        enable_greeting: true,
        llm: {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
          system_messages: [
            {
              parts: [
                {
                  text: systemPrompt || 'You are a helpful voice assistant for a study app. Keep responses very brief and conversational. Answer questions directly in 1-2 sentences.'
                }
              ],
              role: 'user',
            },
          ],
          greeting_message: 'Hello',
          failure_message: 'Sorry, I did not understand that.',
          max_history: 20,
          params: {
            model: 'gemini-2.0-flash',
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
            model_id: 'eleven_flash_v2_5',
            voice_id: process.env.ELEVENLABS_VOICE_ID,
            sample_rate: 24000,
            stability: 0.85,
            similarity_boost: 0.9,
            style: 0.6,
            speed: 1.0,
            use_speaker_boost: true,
          },
        },
      },
    };

    try {
      console.log('📤 Sending configuration to Agora...');
      console.log('📋 Agent Configuration:');
      console.log('  - Channel:', channelName);
      console.log('  - Agent UID:', agentUid);
      console.log('  - App ID:', this.appId);
      console.log('  - Enable Greeting:', payload.properties.enable_greeting);
      console.log('  - ASR: ARES (en-US)');
      console.log('  - LLM: Gemini 2.0 Flash (v1beta, SSE streaming)');
      console.log('  - TTS: ElevenLabs eleven_flash_v2_5 @ 24kHz (enhanced quality)');
      console.log('  - Voice ID:', payload.properties.tts.params.voice_id);
      console.log('  - TTS Settings: stability=0.85, similarity=0.9, style=0.6, speaker_boost=true');
      console.log('  - Greeting Message:', payload.properties.llm.greeting_message);
      console.log('  - Max Tokens:', payload.properties.llm.params.maxOutputTokens);
      console.log('  - Ignore Empty:', payload.properties.llm.ignore_empty);
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
      console.log('');
      console.log('═'.repeat(60));
      console.log('🎤 AGENT IS NOW LIVE AND LISTENING');
      console.log('═'.repeat(60));
      console.log('');
      console.log('What happens next:');
      console.log('  1. User speaks → ASR transcribes to text');
      console.log('  2. Text → Gemini LLM processes');
      console.log('  3. Gemini response → ElevenLabs TTS');
      console.log('  4. TTS audio → Plays to user');
      console.log('');
      console.log('⚠️  NOTE: Conversation content is NOT sent to this backend.');
      console.log('   The dialogue happens directly in the Agora RTC channel.');
      console.log('   See CONVERSATION_LOGGING.md for details.');
      console.log('');
      console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
      
      // Query agent status multiple times to monitor initialization
      const agentId = response.data.agent_id;
      
      setTimeout(async () => {
        try {
          const status1 = await this.queryAgent(agentId);
          console.log('📊 Agent Status (3s):', JSON.stringify(status1, null, 2));
        } catch (error) {
          console.error('❌ Failed to query agent status:', error.message);
        }
      }, 3000);
      
      setTimeout(async () => {
        try {
          const status2 = await this.queryAgent(agentId);
          console.log('📊 Agent Status (6s):', JSON.stringify(status2, null, 2));
          
          if (status2.status === 'RUNNING') {
            console.log('');
            console.log('✅ Agent is fully operational and ready!');
            console.log('');
            console.log('💬 CONVERSATION IS HAPPENING NOW (if user is speaking)');
            console.log('   Check Flutter app logs to see audio state changes');
            console.log('   Look for: "AI IS SPEAKING!" in Flutter console');
            console.log('');
          }
        } catch (error) {
          console.error('❌ Failed to query agent status:', error.message);
        }
      }, 6000);
      
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
