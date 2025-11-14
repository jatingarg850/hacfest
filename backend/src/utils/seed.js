require('dotenv').config();
const connectDB = require('../config/database');
const { seedQuizzes, seedFlashcards } = require('./seedData');

async function runSeed() {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');
    
    await seedQuizzes();
    await seedFlashcards();
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

runSeed();
