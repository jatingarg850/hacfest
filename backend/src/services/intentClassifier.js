const { getIntentModel } = require('../config/gemini');

// Intent types
const INTENTS = {
  NAVIGATION: 'navigation',
  QUERY: 'query',
  STUDY_PLAN: 'study_plan',
  QUIZ: 'quiz',
  FLASHCARD: 'flashcard',
  NEWS: 'news',
  COMMUNITY: 'community',
};

// Navigation targets
const NAVIGATION_TARGETS = {
  HOME: 'home',
  QUIZ: 'quiz',
  NEWS: 'news',
  FLASHCARD: 'flashcard',
  COMMUNITY: 'community',
  STUDY_PLANNER: 'study_planner',
};

const classifyIntent = async (userInput, currentPage = 'home') => {
  const model = getIntentModel();
  
  const prompt = `You are an intent classifier for a study AI app. Analyze the user's input and classify it.

Current page: ${currentPage}

User input: "${userInput}"

Available intents:
1. NAVIGATION - User wants to navigate to a different page (e.g., "go to quiz", "open flashcards", "show me news")
2. QUERY - User has a question or wants explanation (e.g., "explain photosynthesis", "help with calculus")
3. STUDY_PLAN - User wants to create/modify study plan (e.g., "create study plan", "I want to study for 3 hours daily")
4. QUIZ - User wants to interact with quiz (e.g., "start quiz", "next question")
5. FLASHCARD - User wants to create/review flashcards (e.g., "create flashcard", "review cards")
6. NEWS - User wants news (e.g., "latest news", "what's new")
7. COMMUNITY - User wants to chat (e.g., "open community", "chat with others")

Navigation targets: home, quiz, news, flashcard, community, study_planner

Respond ONLY with a JSON object in this exact format:
{
  "intent": "one of the intents above",
  "target": "navigation target if intent is NAVIGATION, otherwise null",
  "confidence": 0.0-1.0,
  "extractedInfo": "any relevant extracted information"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const classification = JSON.parse(jsonMatch[0]);
      return classification;
    }
    
    // Fallback
    return {
      intent: INTENTS.QUERY,
      target: null,
      confidence: 0.5,
      extractedInfo: userInput,
    };
  } catch (error) {
    console.error('Intent classification error:', error);
    return {
      intent: INTENTS.QUERY,
      target: null,
      confidence: 0.3,
      extractedInfo: userInput,
    };
  }
};

module.exports = {
  classifyIntent,
  INTENTS,
  NAVIGATION_TARGETS,
};
