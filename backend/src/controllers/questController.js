const Quest = require('../models/Quest');
const QuestLog = require('../models/QuestLog');
const User = require('../models/User');
const { getComboMultiplier } = require('../utils/combo');

const toDateStr = (date) => new Date(date).toISOString().split('T')[0];

// @desc    Get all quests for user
// @route   GET /api/quests
// @access  Private
const getQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.user._id })
      .populate('categoryId', 'name icon color')
      .sort({ createdAt: -1 });

    // Check which quests are completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await QuestLog.find({
      userId: req.user._id,
      completedAt: { $gte: today, $lt: tomorrow },
    }).select('questId');

    const completedTodayIds = new Set(todayLogs.map((l) => l.questId.toString()));

    const questsWithStatus = quests.map((q) => ({
      ...q.toObject(),
      completedToday: completedTodayIds.has(q._id.toString()),
    }));

    res.status(200).json({
      success: true,
      count: quests.length,
      data: questsWithStatus,
    });
  } catch (error) {
    console.error('GetQuests error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new quest
// @route   POST /api/quests
// @access  Private
const createQuest = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty } = req.body;

    if (!title || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and category',
      });
    }

    const { schedule, reminderEnabled, reminderTime } = req.body;
    const baseXP = 30;
    const xpReward = baseXP * (difficulty || 2);

    const quest = await Quest.create({
      userId: req.user._id,
      title,
      description,
      categoryId,
      difficulty: difficulty || 2,
      xpReward,
      schedule: schedule && schedule.length > 0 ? schedule : [0, 1, 2, 3, 4, 5, 6],
      reminderEnabled: !!reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime || null : null,
    });

    const populatedQuest = await Quest.findById(quest._id).populate(
      'categoryId',
      'name icon color'
    );

    res.status(201).json({
      success: true,
      data: { ...populatedQuest.toObject(), completedToday: false },
    });
  } catch (error) {
    console.error('CreateQuest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update quest
// @route   PUT /api/quests/:id
// @access  Private
const updateQuest = async (req, res) => {
  try {
    const { title, description, categoryId, difficulty, schedule, reminderEnabled, reminderTime } = req.body;

    const quest = await Quest.findOne({ _id: req.params.id, userId: req.user._id });
    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    if (title) quest.title = title;
    if (description !== undefined) quest.description = description;
    if (categoryId) quest.categoryId = categoryId;
    if (difficulty) {
      quest.difficulty = difficulty;
      quest.xpReward = 30 * difficulty;
    }
    if (schedule && schedule.length > 0) quest.schedule = schedule;
    if (reminderEnabled !== undefined) {
      quest.reminderEnabled = !!reminderEnabled;
      quest.reminderTime = reminderEnabled ? reminderTime || null : null;
    }

    await quest.save();

    const populated = await Quest.findById(quest._id).populate('categoryId', 'name icon color');

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error('UpdateQuest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete quest (adds entry to QuestLog)
// @route   PATCH /api/quests/:id/complete
// @access  Private
const completeQuest = async (req, res) => {
  try {
    const quest = await Quest.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    // Prevent completing the same quest twice in one day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await QuestLog.findOne({
      userId: req.user._id,
      questId: quest._id,
      completedAt: { $gte: today, $lt: tomorrow },
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        message: 'Quest already completed today',
      });
    }

    // --- Combo za regularność ---
    // Streak = liczba dni z rzędu (z ukończeniem) kończąca się dziś.
    // Dziś liczymy jako zaliczony, bo właśnie kończymy misję.
    const priorLogs = await QuestLog.find({ userId: req.user._id }).select('completedAt');
    const days = new Set(priorLogs.map((l) => toDateStr(l.completedAt)));
    days.add(toDateStr(new Date()));

    let streak = 0;
    const check = new Date();
    while (days.has(toDateStr(check))) {
      streak++;
      check.setDate(check.getDate() - 1);
    }

    const multiplier = getComboMultiplier(streak);
    const baseXP = quest.xpReward;
    const xpEarned = Math.round(baseXP * multiplier);

    // Create log entry (zapisujemy XP już z bonusem combo)
    await QuestLog.create({
      userId: req.user._id,
      questId: quest._id,
      xpEarned,
    });

    // Add XP to user
    const user = await User.findById(req.user._id);
    user.totalXP += xpEarned;
    const leveledUp = user.checkLevelUp();
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        questId: quest._id,
        baseXP,
        multiplier,
        streak,
        bonusXP: xpEarned - baseXP,
        xpEarned,
        leveledUp,
        newLevel: user.level,
        totalXP: user.totalXP,
      },
    });
  } catch (error) {
    console.error('CompleteQuest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete quest
// @route   DELETE /api/quests/:id
// @access  Private
const deleteQuest = async (req, res) => {
  try {
    const quest = await Quest.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('DeleteQuest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getQuests, createQuest, updateQuest, completeQuest, deleteQuest };
