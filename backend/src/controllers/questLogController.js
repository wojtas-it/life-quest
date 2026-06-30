const QuestLog = require('../models/QuestLog');

// @desc    Get quest log for a specific date
// @route   GET /api/questlog?date=YYYY-MM-DD
// @access  Private
const getLogByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const day = date ? new Date(date) : new Date();
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const logs = await QuestLog.find({
      userId: req.user._id,
      completedAt: { $gte: day, $lt: nextDay },
    }).populate('questId', 'title categoryId xpReward difficulty');

    res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error('GetLogByDate error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLogByDate };
