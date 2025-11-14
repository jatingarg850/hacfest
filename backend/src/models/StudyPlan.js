const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topics: [{
    name: String,
    completed: { type: Boolean, default: false },
  }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  dailyStudyHours: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  holidays: [{
    date: Date,
    reason: String,
  }],
  schedule: [{
    date: Date,
    topics: [String],
    hours: Number,
    completed: { type: Boolean, default: false },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
