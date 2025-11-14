const { getConversationalModel } = require('../config/gemini');

// Get educational news (AI-generated summaries)
exports.getNews = async (req, res) => {
  try {
    const { category = 'general' } = req.query;
    
    // In production, integrate with real news API
    // For now, generate sample educational news
    const news = [
      {
        id: 1,
        title: 'New Study Techniques Boost Memory Retention by 40%',
        summary: 'Recent research shows that active recall combined with spaced repetition significantly improves long-term memory.',
        category: 'study-tips',
        date: new Date(),
      },
      {
        id: 2,
        title: 'AI in Education: The Future of Personalized Learning',
        summary: 'Artificial intelligence is revolutionizing how students learn with adaptive learning systems.',
        category: 'technology',
        date: new Date(),
      },
      {
        id: 3,
        title: 'Top Universities Announce Free Online Courses',
        summary: 'Leading institutions are offering free access to premium courses in STEM fields.',
        category: 'education',
        date: new Date(),
      },
    ];

    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Summarize news article
exports.summarizeNews = async (req, res) => {
  try {
    const { content } = req.body;
    const model = getConversationalModel();

    const prompt = `Summarize this educational news article in 2-3 sentences:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
