const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Controllers
const authController = require('../controllers/authController');
const agoraController = require('../controllers/agoraController');
const intentController = require('../controllers/intentController');
const studyPlanController = require('../controllers/studyPlanController');
const quizController = require('../controllers/quizController');
const flashcardController = require('../controllers/flashcardController');
const newsController = require('../controllers/newsController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getMe);

// Agora voice routes
router.post('/voice/start', auth, agoraController.startVoiceSession);
router.post('/voice/stop', auth, agoraController.stopVoiceSession);
router.get('/voice/session/:id', auth, agoraController.getSession);

// Intent classification
router.post('/intent/classify', auth, intentController.classifyUserIntent);

// Study plan routes
router.post('/study-plan', auth, studyPlanController.createStudyPlan);
router.get('/study-plan', auth, studyPlanController.getStudyPlan);
router.patch('/study-plan/:id', auth, studyPlanController.updateStudyPlan);
router.patch('/study-plan/:id/complete-day', auth, studyPlanController.completeDayTask);

// Quiz routes
router.get('/quizzes', auth, quizController.getQuizzes);
router.get('/quizzes/:id', auth, quizController.getQuizById);
router.post('/quizzes/submit', auth, quizController.submitQuiz);

// Flashcard routes
router.post('/flashcards', auth, flashcardController.createFlashcard);
router.get('/flashcards', auth, flashcardController.getFlashcards);
router.patch('/flashcards/:id/review', auth, flashcardController.reviewFlashcard);
router.delete('/flashcards/:id', auth, flashcardController.deleteFlashcard);

// News routes
router.get('/news', auth, newsController.getNews);
router.post('/news/summarize', auth, newsController.summarizeNews);

module.exports = router;
