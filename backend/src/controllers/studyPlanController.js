const StudyPlan = require('../models/StudyPlan');
const User = require('../models/User');
const studyPlanGenerator = require('../services/studyPlanGenerator');

// Create study plan
exports.createStudyPlan = async (req, res) => {
  try {
    const { topics, startDate, endDate, dailyStudyHours, holidays } = req.body;
    const userId = req.userId;

    // Generate schedule using AI
    const schedule = await studyPlanGenerator.generatePlan(
      topics,
      startDate,
      endDate,
      dailyStudyHours,
      holidays
    );

    // Create study plan
    const studyPlan = new StudyPlan({
      userId,
      topics: topics.map(t => ({ name: t, completed: false })),
      startDate,
      endDate,
      dailyStudyHours,
      holidays: holidays || [],
      schedule,
    });

    await studyPlan.save();

    // Update user reference
    await User.findByIdAndUpdate(userId, { studyPlan: studyPlan._id });

    res.status(201).json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get study plan
exports.getStudyPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const studyPlan = await StudyPlan.findOne({ userId });
    
    if (!studyPlan) {
      return res.status(404).json({ error: 'No study plan found' });
    }

    res.json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update study plan
exports.updateStudyPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const studyPlan = await StudyPlan.findByIdAndUpdate(id, updates, { new: true });
    
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    res.json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark day as completed
exports.completeDayTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const studyPlan = await StudyPlan.findById(id);
    if (!studyPlan) {
      return res.status(404).json({ error: 'Study plan not found' });
    }

    // Find and mark the day as completed
    const daySchedule = studyPlan.schedule.find(
      s => s.date.toISOString().split('T')[0] === date
    );

    if (daySchedule) {
      daySchedule.completed = true;
      await studyPlan.save();
    }

    res.json({ studyPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
