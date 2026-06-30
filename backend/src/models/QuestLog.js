const mongoose = require('mongoose');

const questLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  questId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest',
    required: true,
  },
  xpEarned: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

questLogSchema.index({ userId: 1, completedAt: -1 });
questLogSchema.index({ userId: 1, questId: 1, completedAt: -1 });

module.exports = mongoose.model('QuestLog', questLogSchema);
