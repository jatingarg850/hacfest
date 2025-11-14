const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Intent classification model
const getIntentModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

// Conversational model for study planning
const getConversationalModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

module.exports = {
  getIntentModel,
  getConversationalModel,
};
