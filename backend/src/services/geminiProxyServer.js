require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log('📥 Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Proxy endpoint that converts Gemini to Agora-compatible SSE format
app.post('/v1/chat/completions', async (req, res) => {
  try {
    let { messages, model = 'gemini-2.0-flash', temperature = 0.7, max_tokens = 150 } = req.body;
    
    // Map model names to available Gemini models
    if (model === 'gemini-1.5-flash' || model === 'gemini-1.5-pro') {
      model = 'gemini-2.0-flash'; // Use 2.0 instead
    }
    
    console.log('📨 Proxy received request:', JSON.stringify({ messages, model }, null, 2));
    
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Build conversation history for Gemini
    const geminiContents = [];
    
    for (const msg of messages) {
      if (msg.role === 'system') {
        // Add system message as first user message
        geminiContents.push({
          parts: [{ text: msg.content }],
          role: 'user'
        });
        geminiContents.push({
          parts: [{ text: 'Understood. I will act as described.' }],
          role: 'model'
        });
      } else if (msg.role === 'user') {
        geminiContents.push({
          parts: [{ text: msg.content || 'Hello' }],
          role: 'user'
        });
      } else if (msg.role === 'assistant') {
        geminiContents.push({
          parts: [{ text: msg.content }],
          role: 'model'
        });
      }
    }
    
    console.log('🔄 Converted to Gemini format:', JSON.stringify(geminiContents, null, 2));
    
    // Call Gemini API (use v1 instead of v1beta)
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: geminiContents,
        generationConfig: {
          temperature,
          maxOutputTokens: max_tokens,
        },
      }
    );
    
    const text = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response.';
    
    console.log('✅ Gemini response:', text.substring(0, 100));
    
    // Send in OpenAI-compatible SSE format
    const chunk = {
      id: 'chatcmpl-' + Date.now(),
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [{
        index: 0,
        delta: { content: text },
        finish_reason: null
      }]
    };
    
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    
    // Send final chunk
    const finalChunk = {
      ...chunk,
      choices: [{
        index: 0,
        delta: {},
        finish_reason: 'stop'
      }]
    };
    
    res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    console.error('❌ Error details:', error.response?.data || error);
    res.status(500).json({ error: error.message, details: error.response?.data });
  }
});

const PROXY_PORT = 3001;
app.listen(PROXY_PORT, () => {
  console.log(`🔄 Gemini Proxy Server running on port ${PROXY_PORT}`);
});
