const Quiz = require('../models/Quiz');

// Sample quizzes for testing
const sampleQuizzes = [
  {
    title: 'Physics - Motion and Forces',
    subject: 'Physics',
    year: 2023,
    difficulty: 'medium',
    questions: [
      {
        question: 'What is Newton\'s First Law of Motion?',
        options: [
          'F = ma',
          'An object at rest stays at rest unless acted upon by an external force',
          'For every action, there is an equal and opposite reaction',
          'E = mc²'
        ],
        correctAnswer: 1,
        explanation: 'Newton\'s First Law, also known as the law of inertia, states that an object at rest will remain at rest, and an object in motion will remain in motion at constant velocity, unless acted upon by an external force.'
      },
      {
        question: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1,
        explanation: 'The SI unit of force is the Newton (N), named after Sir Isaac Newton. One Newton is the force required to accelerate a mass of one kilogram at a rate of one meter per second squared.'
      },
      {
        question: 'What is acceleration due to gravity on Earth?',
        options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '11.2 m/s²'],
        correctAnswer: 1,
        explanation: 'The acceleration due to gravity on Earth is approximately 9.8 m/s². This means that in the absence of air resistance, all objects fall with the same acceleration.'
      }
    ]
  },
  {
    title: 'Mathematics - Algebra Basics',
    subject: 'Mathematics',
    year: 2023,
    difficulty: 'easy',
    questions: [
      {
        question: 'Solve for x: 2x + 5 = 15',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 10'],
        correctAnswer: 1,
        explanation: 'Subtract 5 from both sides: 2x = 10. Then divide both sides by 2: x = 5.'
      },
      {
        question: 'What is the value of x² when x = 4?',
        options: ['8', '12', '16', '20'],
        correctAnswer: 2,
        explanation: 'x² means x multiplied by itself. So 4² = 4 × 4 = 16.'
      }
    ]
  },
  {
    title: 'Chemistry - Periodic Table',
    subject: 'Chemistry',
    year: 2022,
    difficulty: 'hard',
    questions: [
      {
        question: 'What is the atomic number of Carbon?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 1,
        explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.'
      },
      {
        question: 'Which element has the symbol "Au"?',
        options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
        correctAnswer: 1,
        explanation: 'Au is the chemical symbol for Gold, derived from the Latin word "aurum".'
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    // Clear existing quizzes
    await Quiz.deleteMany({});
    
    // Insert sample quizzes
    await Quiz.insertMany(sampleQuizzes);
    
    console.log('✅ Sample quizzes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
  }
}

module.exports = { seedQuizzes };
