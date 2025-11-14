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
          url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
          system_messages: [
            {
              parts: [
                {
                  text: systemPrompt || 'You are a voice-first study assistant. Intents: open, back, search, quiz, flashcard, news, community. When intent is clear, emit a JSON tool call first with minimal parameters, then say a short confirmation. Keep answers brief.'
                }
              ],
              role: 'user',
            },
          ],
          greeting_message: 'Hi! What would you like to do?',
          failure_message: 'Please say that again.',
          max_history: 16,
          params: {
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            maxOutputTokens: 80,
            tools: [
              {
                type: 'function',
                function: {
                  name: 'navigate',
                  description: 'App navigation and actions.',
                  parameters: {
                    type: 'object',
                    properties: {
                      action: {
                        type: 'string',
                        enum: ['open', 'back', 'search', 'quiz', 'flashcard', 'news', 'community']
                      },
                      target: {
                        type: 'string'
                      },
                      value: {
                        type: 'string'
                      }
                    },
                    required: ['action']
                  }
                }
              }
            ],
            tool_choice: 'auto'
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
          },
        },
      },
    };

    try {
      console.log('📤 Sending BLUEPRINT configuration to Agora...');
      console.log('📋 Agent Configuration:');
      console.log('  - Channel:', channelName);
      console.log('  - Agent UID:', agentUid);
      console.log('  - App ID:', this.appId);
      console.log('  - Enable Greeting:', payload.properties.enable_greeting);
      console.log('  - ASR: ARES (en-US)');
      console.log('  - LLM: Gemini 1.5 Flash (v1, direct SSE, style=gemini, parts-based)');
      console.log('  - TTS: ElevenLabs eleven_flash_v2_5 @ 24kHz');
      console.log('  - Voice ID:', payload.properties.tts.params.voice_id);
      console.log('  - Greeting Message:', payload.properties.llm.greeting_message);
      console.log('  - Max Tokens:', payload.properties.llm.params.maxOutputTokens);
      console.log('  - Tools:', payload.properties.llm.params.tools?.length || 0, 'functions');
      console.log('  - Tool Choice:', payload.properties.llm.params.tool_choice);
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
      console.log('⏳ Agent is now listening for user speech...');
      console.log('📊 Full response:', JSON.stringify(response.data, null, 2));
      
      // Query agent status after 3 seconds to get internal logs
      setTimeout(async () => {
        try {
          const statusResponse = await this.queryAgent(response.data.agent_id);
          console.log('📊 Agent Status Check:', JSON.stringify(statusResponse, null, 2));
        } catch (error) {
          console.error('❌ Failed to query agent status:', error.message);
        }
      }, 3000);
      
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
