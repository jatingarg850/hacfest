const express = require('express');
const axios = require('axios');

const router = express.Router();

// Proxy endpoint that converts Gemini streaming to Agora-compatible format
router.post('/stream', async (req, res) => {
  const { messages, model = 'gemini-1.5-flash', temperature = 0.7, maxOutputTokens = 100 } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`,
      {
        contents: messages,
        generationConfig: {
          temperature,
          maxOutputTokens,
        },
      },
      {
        responseType: 'stream',
      }
    );

    // Forward the stream
    response.data.pipe(res);
  } catch (error) {
    console.error('Gemini proxy error:', error.message);
    res.status(500).json({ error: 'Proxy error' });
  }
});

module.exports = router;
