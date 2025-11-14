require('dotenv').config();
const mongoose = require('mongoose');
const { seedQuizzes } = require('../src/utils/seedData');

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Seed data
    await seedQuizzes();

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
