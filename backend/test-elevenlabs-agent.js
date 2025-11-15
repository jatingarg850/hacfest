import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function testElevenLabsAgent() {
  console.log('Testing ElevenLabs Conversational AI Agent...');
  
  try {
    const agent = await elevenlabs.conversationalAi.agents.create({
      name: "Study Assistant Test",
      conversationConfig: {
        agent: {
          prompt: {
            prompt: "You are a helpful study assistant. Keep responses brief and encouraging.",
          },
        },
      },
    });
    
    console.log('✅ ElevenLabs agent created!');
    console.log('Agent ID:', agent.agent_id);
    console.log('Full response:', JSON.stringify(agent, null, 2));
    
    console.log('\n📝 This is a native ElevenLabs agent (not Agora)');
    console.log('   It handles voice conversation entirely through ElevenLabs');
    console.log('   No Agora RTC channel needed!');
    
  } catch (error) {
    console.error('❌ Failed to create ElevenLabs agent:');
    console.error('Error:', error.message);
    console.error('Details:', error.response?.data);
  }
}

testElevenLabsAgent();
