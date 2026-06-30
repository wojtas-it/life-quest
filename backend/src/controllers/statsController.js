const QuestLog = require('../models/QuestLog');
const User = require('../models/User');
const { getComboMultiplier } = require('../utils/combo');

const toDateStr = (date) => new Date(date).toISOString().split('T')[0];

// @desc    Get user statistics
// @route   GET /api/stats?period=7|30
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = parseInt(req.query.period) || 7;

    const user = await User.findById(userId);

    // --- XP by day (last N days) ---
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period + 1);
    startDate.setHours(0, 0, 0, 0);

    const recentLogs = await QuestLog.find({
      userId,
      completedAt: { $gte: startDate },
    });

    const xpByDay = {};
    for (let i = 0; i < period; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      xpByDay[toDateStr(d)] = 0;
    }
    recentLogs.forEach((l) => {
      const d = toDateStr(l.completedAt);
      if (xpByDay[d] !== undefined) xpByDay[d] += l.xpEarned;
    });

    // --- By category ---
    const allLogs = await QuestLog.find({ userId }).populate({
      path: 'questId',
      select: 'categoryId',
      populate: { path: 'categoryId', select: 'name color icon' },
    });

    const byCat = {};
    allLogs.forEach((l) => {
      const cat = l.questId?.categoryId;
      if (!cat) return;
      const key = cat._id.toString();
      if (!byCat[key]) byCat[key] = { name: cat.name, color: cat.color, icon: cat.icon, count: 0 };
      byCat[key].count++;
    });

    // --- Streak ---
    const uniqueDays = [
      ...new Set(allLogs.map((l) => toDateStr(l.completedAt))),
    ].sort().reverse();

    const todayStr = toDateStr(new Date());
    const yesterdayStr = toDateStr(new Date(Date.now() - 86400000));

    let streak = 0;
    if (uniqueDays.includes(todayStr) || uniqueDays.includes(yesterdayStr)) {
      let check = new Date(uniqueDays.includes(todayStr) ? todayStr : yesterdayStr);
      while (uniqueDays.includes(toDateStr(check))) {
        streak++;
        check.setDate(check.getDate() - 1);
      }
    }

    // --- Najdłuższy streak (najdłuższa seria kolejnych dni) ---
    let longestStreak = 0;
    const sortedAsc = [...uniqueDays].sort();
    let run = 0;
    let prev = null;
    for (const dStr of sortedAsc) {
      if (prev) {
        const diff = (new Date(dStr) - new Date(prev)) / 86400000;
        run = diff === 1 ? run + 1 : 1;
      } else {
        run = 1;
      }
      if (run > longestStreak) longestStreak = run;
      prev = dStr;
    }

    // --- Activity calendar (last 30 days) ---
    const calStart = new Date();
    calStart.setDate(calStart.getDate() - 29);
    calStart.setHours(0, 0, 0, 0);

    const calLogs = await QuestLog.find({
      userId,
      completedAt: { $gte: calStart },
    }).select('completedAt');

    const activityDays = [...new Set(calLogs.map((l) => toDateStr(l.completedAt)))];

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalXP: user.totalXP,
          level: user.level,
          totalCompleted: allLogs.length,
          currentStreak: streak,
          longestStreak,
          comboMultiplier: getComboMultiplier(streak),
        },
        xpByDay: Object.entries(xpByDay).map(([date, xp]) => ({ date, xp })),
        byCategory: Object.values(byCat),
        activityDays,
      },
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats };
