const { getIntentModel } = require('../config/gemini');

class VoiceNavigationService {
  async parseVoiceCommand(text, currentPage) {
    const model = getIntentModel();
    
    const prompt = `You are a voice navigation assistant. Parse the user's voice command and determine their intent.

User said: "${text}"
Current page: ${currentPage}

Available navigation commands:
- "open quiz" / "take quiz" / "start quiz" → navigate to quiz page
- "open flashcards" / "show flashcards" / "study flashcards" → navigate to flashcards page
- "open news" / "show news" / "read news" → navigate to news page
- "open community" / "show community" / "chat" → navigate to community page
- "go home" / "home page" / "main page" → navigate to home page
- "go back" / "back" / "previous page" → go back
- "study planner" / "my plan" / "schedule" → open study planner

Respond with ONLY a JSON object:
{
  "intent": "navigate" | "question" | "unknown",
  "action": "open_quiz" | "open_flashcards" | "open_news" | "open_community" | "go_home" | "go_back" | "open_study_planner" | null,
  "response": "Brief confirmation message"
}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('🎯 Voice command parsed:', parsed);
        return parsed;
      }
      
      // Fallback
      return {
        intent: 'unknown',
        action: null,
        response: 'I did not understand that. Try saying "open quiz" or "go home".'
      };
    } catch (error) {
      console.error('❌ Voice navigation error:', error.message);
      return {
        intent: 'unknown',
        action: null,
        response: 'Sorry, I had trouble understanding that.'
      };
    }
  }

  // Simple keyword-based fallback (faster)
  parseCommandSimple(text) {
    const lower = text.toLowerCase();
    
    if (lower.includes('quiz') || lower.includes('test')) {
      return { intent: 'navigate', action: 'open_quiz', response: 'Opening quiz' };
    }
    if (lower.includes('flashcard') || lower.includes('flash card')) {
      return { intent: 'navigate', action: 'open_flashcards', response: 'Opening flashcards' };
    }
    if (lower.includes('news')) {
      return { intent: 'navigate', action: 'open_news', response: 'Opening news' };
    }
    if (lower.includes('community') || lower.includes('chat')) {
      return { intent: 'navigate', action: 'open_community', response: 'Opening community' };
    }
    if (lower.includes('home') || lower.includes('main')) {
      return { intent: 'navigate', action: 'go_home', response: 'Going home' };
    }
    if (lower.includes('back') || lower.includes('previous')) {
      return { intent: 'navigate', action: 'go_back', response: 'Going back' };
    }
    if (lower.includes('plan') || lower.includes('schedule')) {
      return { intent: 'navigate', action: 'open_study_planner', response: 'Opening study planner' };
    }
    
    return { intent: 'question', action: null, response: null };
  }
}

module.exports = new VoiceNavigationService();
