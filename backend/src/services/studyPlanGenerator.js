const { getConversationalModel } = require('../config/gemini');

class StudyPlanGenerator {
  async generatePlan(topics, startDate, endDate, dailyHours, holidays = []) {
    const model = getConversationalModel();
    
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const holidayDates = holidays.map(h => new Date(h.date).toISOString().split('T')[0]);
    
    const prompt = `Create a detailed study plan with the following parameters:

Topics to cover: ${topics.join(', ')}
Start date: ${startDate}
End date: ${endDate}
Total days: ${totalDays}
Daily study hours: ${dailyHours}
Holidays: ${holidayDates.join(', ') || 'None'}

Generate a day-by-day study schedule that:
1. Distributes topics evenly across available days
2. Avoids holidays
3. Respects daily study hour limits
4. Includes review sessions
5. Balances difficulty

Respond with a JSON array of daily schedules in this format:
[
  {
    "date": "YYYY-MM-DD",
    "topics": ["topic1", "topic2"],
    "hours": 3,
    "description": "Focus on fundamentals"
  }
]

Respond ONLY with the JSON array, no other text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON array
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const schedule = JSON.parse(jsonMatch[0]);
        return schedule;
      }
      
      // Fallback: simple distribution
      return this.generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates);
    } catch (error) {
      console.error('Study plan generation error:', error);
      return this.generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates);
    }
  }

  generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates) {
    const schedule = [];
    const start = new Date(startDate);
    let topicIndex = 0;

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Skip holidays
      if (holidayDates.includes(dateStr)) continue;

      schedule.push({
        date: currentDate,
        topics: [topics[topicIndex % topics.length]],
        hours: dailyHours,
        completed: false,
      });

      topicIndex++;
    }

    return schedule;
  }
}

module.exports = new StudyPlanGenerator();
