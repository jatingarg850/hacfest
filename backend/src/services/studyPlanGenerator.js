const { getConversationalModel } = require('../config/gemini');

class StudyPlanGenerator {
  async generatePlan(topics, startDate, endDate, dailyHours, holidays = [], breakCount = 2) {
    const model = getConversationalModel();
    
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const holidayDates = holidays.map(h => new Date(h.date).toISOString().split('T')[0]);
    
    console.log('🤖 Generating study plan with Gemini AI...');
    console.log('Topics:', topics.join(', '));
    console.log('Duration:', totalDays, 'days');
    console.log('Daily hours:', dailyHours);
    console.log('Breaks per session:', breakCount);
    
    const prompt = `You are an expert study planner. Create a comprehensive, personalized study schedule.

**Study Plan Requirements:**
- Topics: ${topics.join(', ')}
- Start Date: ${startDate}
- End Date: ${endDate}
- Total Days: ${totalDays}
- Daily Study Hours: ${dailyHours}
- Breaks per Session: ${breakCount}
- Holidays to Skip: ${holidayDates.join(', ') || 'None'}

**Instructions:**
1. Distribute topics intelligently across ${totalDays} days
2. Skip all holiday dates
3. Each day should have ${dailyHours} hours of study time
4. Include ${breakCount} breaks per study session (15-20 min each)
5. Start with fundamentals, progress to advanced topics
6. Include review days every 5-7 days
7. Balance workload - don't overload any single day
8. Add motivational descriptions for each day

**Output Format (JSON only, no markdown):**
[
  {
    "date": "YYYY-MM-DD",
    "topics": ["topic1", "topic2"],
    "hours": ${dailyHours},
    "description": "Brief motivational description"
  }
]

Generate the complete schedule now. Return ONLY the JSON array.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      console.log('✅ Gemini response received');
      
      // Extract JSON array (handle markdown code blocks)
      let jsonText = response;
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON array
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const schedule = JSON.parse(jsonMatch[0]);
        console.log('✅ Generated', schedule.length, 'days of study schedule');
        return schedule;
      }
      
      console.log('⚠️  Could not parse Gemini response, using fallback');
      return this.generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates, breakCount);
    } catch (error) {
      console.error('❌ Study plan generation error:', error.message);
      return this.generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates, breakCount);
    }
  }

  generateSimplePlan(topics, startDate, totalDays, dailyHours, holidayDates, breakCount = 2) {
    console.log('📝 Generating simple fallback plan...');
    const schedule = [];
    const start = new Date(startDate);
    let topicIndex = 0;
    let dayCount = 0;

    for (let i = 0; i < totalDays && dayCount < totalDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      // Skip holidays
      if (holidayDates.includes(dateStr)) continue;

      const isReviewDay = (dayCount + 1) % 7 === 0;
      const currentTopic = topics[topicIndex % topics.length];
      
      schedule.push({
        date: currentDate,
        topics: isReviewDay ? ['Review: ' + topics.slice(0, topicIndex + 1).join(', ')] : [currentTopic],
        hours: dailyHours,
        description: isReviewDay 
          ? `Review day - consolidate your learning with ${breakCount} breaks`
          : `Focus on ${currentTopic} - ${breakCount} breaks included`,
        completed: false,
      });

      if (!isReviewDay) topicIndex++;
      dayCount++;
    }

    console.log('✅ Fallback plan generated:', schedule.length, 'days');
    return schedule;
  }
}

module.exports = new StudyPlanGenerator();
