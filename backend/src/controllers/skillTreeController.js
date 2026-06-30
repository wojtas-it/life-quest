const QuestLog = require('../models/QuestLog');
const Category = require('../models/Category');
const SKILL_TITLES = require('../constants/skillTitles');

// Próg XP wymagany, by OSIĄGNĄĆ dany poziom (ta sama formuła co User.getXPForLevel).
// Poziom 1 = 0 XP. Poziom L (L>=2) = floor(100 * 1.5^(L-1)).
const xpThreshold = (level) => (level <= 1 ? 0 : Math.floor(100 * Math.pow(1.5, level - 1)));

// Poziom wynikający z posiadanego XP.
const computeLevel = (xp) => {
  let level = 1;
  while (xp >= xpThreshold(level + 1)) level++;
  return level;
};

// @desc    Skill Tree — postęp XP i poziom per kategoria + odblokowane tytuły
// @route   GET /api/skilltree
// @access  Private
const getSkillTree = async (req, res) => {
  try {
    const userId = req.user._id;

    const categories = await Category.find();

    // Suma XP per kategoria z logów (liczone w locie — bez dodatkowych pól w bazie).
    const logs = await QuestLog.find({ userId }).populate({
      path: 'questId',
      select: 'categoryId',
    });

    const xpByCat = {};
    logs.forEach((l) => {
      const cid = l.questId?.categoryId?.toString();
      if (!cid) return;
      xpByCat[cid] = (xpByCat[cid] || 0) + l.xpEarned;
    });

    const tree = categories.map((cat) => {
      const xp = xpByCat[cat._id.toString()] || 0;
      const level = computeLevel(xp);
      const currentThreshold = xpThreshold(level);
      const nextThreshold = xpThreshold(level + 1);
      const span = nextThreshold - currentThreshold;
      const progress = span > 0 ? (xp - currentThreshold) / span : 1;

      const tiers = (SKILL_TITLES[cat.name] || []).map((t) => ({
        level: t.level,
        title: t.title,
        unlocked: level >= t.level,
      }));

      const currentTitle = [...tiers].reverse().find((t) => t.unlocked)?.title || null;
      const nextTier = tiers.find((t) => !t.unlocked) || null;

      return {
        id: cat._id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        xp,
        level,
        currentThreshold,
        nextThreshold,
        progress: Math.max(0, Math.min(1, progress)),
        tiers,
        currentTitle,
        nextTier,
      };
    });

    // Tytuł wiodący = z kategorii o najwyższym poziomie (na potrzeby profilu).
    const topBranch = [...tree].sort((a, b) => b.level - a.level)[0];
    const topTitle = topBranch?.currentTitle || null;

    res.status(200).json({
      success: true,
      data: { tree, topTitle },
    });
  } catch (error) {
    console.error('GetSkillTree error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkillTree };
