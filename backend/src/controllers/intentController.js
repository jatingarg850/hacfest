const { classifyIntent } = require('../services/intentClassifier');

// Classify user intent
exports.classifyUserIntent = async (req, res) => {
  try {
    const { text, currentPage } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const classification = await classifyIntent(text, currentPage);
    res.json(classification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
