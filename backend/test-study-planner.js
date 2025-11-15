require('dotenv').config();
const studyPlanGenerator = require('./src/services/studyPlanGenerator');

async function testStudyPlanner() {
  console.log('🧪 Testing Study Planner with Gemini AI\n');
  console.log('═'.repeat(60));
  
  const topics = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dailyHours = 4;
  const breakCount = 3;
  
  console.log('\n📋 Test Parameters:');
  console.log('  Topics:', topics.join(', '));
  console.log('  Start Date:', startDate);
  console.log('  End Date:', endDate);
  console.log('  Daily Hours:', dailyHours);
  console.log('  Breaks per Session:', breakCount);
  console.log('\n' + '═'.repeat(60));
  
  try {
    console.log('\n🚀 Generating study plan...\n');
    
    const schedule = await studyPlanGenerator.generatePlan(
      topics,
      startDate,
      endDate,
      dailyHours,
      [],
      breakCount
    );
    
    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ Study Plan Generated Successfully!\n');
    console.log('📊 Summary:');
    console.log('  Total Days:', schedule.length);
    console.log('  Total Hours:', schedule.reduce((sum, day) => sum + day.hours, 0));
    console.log('\n📅 First 5 Days:\n');
    
    schedule.slice(0, 5).forEach((day, index) => {
      console.log(`Day ${index + 1}: ${new Date(day.date).toDateString()}`);
      console.log(`  Topics: ${day.topics.join(', ')}`);
      console.log(`  Hours: ${day.hours}`);
      console.log(`  Description: ${day.description || 'N/A'}`);
      console.log('');
    });
    
    console.log('═'.repeat(60));
    console.log('\n✅ Test completed successfully!');
    console.log('\nThe study planner is working correctly with Gemini AI.');
    
  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    console.error('\nStack:', error.stack);
  }
}

testStudyPlanner();
