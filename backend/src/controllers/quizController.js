const Quiz = require('../models/Quiz');
const User = require('../models/User');

// Get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const { subject, year, difficulty } = req.query;
    const filter = {};
    
    if (subject) filter.subject = subject;
    if (year) filter.year = parseInt(year);
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter).select('-questions.correctAnswer -questions.explanation');
    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.userId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Calculate score
    let correctCount = 0;
    const results = quiz.questions.map((q, index) => {
      const isCorrect = answers[index] === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionIndex: index,
        userAnswer: answers[index],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = (correctCount / quiz.questions.length) * 100;

    // Save score
    await User.findByIdAndUpdate(userId, {
      $push: {
        quizScores: {
          quizId,
          score,
          completedAt: new Date(),
        },
      },
    });

    res.json({ score, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
