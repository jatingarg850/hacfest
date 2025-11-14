const Flashcard = require('../models/Flashcard');

// Create flashcard
exports.createFlashcard = async (req, res) => {
  try {
    const { front, back, subject } = req.body;
    const userId = req.userId;

    const flashcard = new Flashcard({
      userId,
      front,
      back,
      subject,
    });

    await flashcard.save();
    res.status(201).json({ flashcard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get flashcards
exports.getFlashcards = async (req, res) => {
  try {
    const userId = req.userId;
    const { subject } = req.query;
    
    const filter = { userId };
    if (subject) filter.subject = subject;

    const flashcards = await Flashcard.find(filter).sort({ nextReview: 1 });
    res.json({ flashcards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Review flashcard (spaced repetition)
exports.reviewFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const { difficulty } = req.body; // 0-5 scale

    const flashcard = await Flashcard.findById(id);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    // Simple spaced repetition algorithm
    const intervals = [1, 3, 7, 14, 30]; // days
    const nextInterval = intervals[Math.min(flashcard.reviewCount, intervals.length - 1)];
    
    flashcard.reviewCount += 1;
    flashcard.difficulty = difficulty;
    flashcard.nextReview = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000);
    
    await flashcard.save();
    res.json({ flashcard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete flashcard
exports.deleteFlashcard = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const flashcard = await Flashcard.findOneAndDelete({ _id: id, userId });
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
