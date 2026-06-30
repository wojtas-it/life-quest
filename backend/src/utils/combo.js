// Combo za regularność — łagodny mnożnik XP zależny od streaka (dni z rzędu).
// Sufit 1.5×, żeby nagradzać konsekwencję bez psucia balansu XP.

const COMBO_TIERS = [
  { minStreak: 30, multiplier: 1.5 },
  { minStreak: 14, multiplier: 1.35 },
  { minStreak: 7, multiplier: 1.2 },
  { minStreak: 3, multiplier: 1.1 },
];

const getComboMultiplier = (streak) => {
  for (const tier of COMBO_TIERS) {
    if (streak >= tier.minStreak) return tier.multiplier;
  }
  return 1.0;
};

module.exports = { getComboMultiplier, COMBO_TIERS };
