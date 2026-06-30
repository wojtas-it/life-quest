// API Configuration
export const API_URL = __DEV__
  ? 'http://localhost:5000/api' // Development - change to your PC's IP if using a physical device
  : 'https://your-production-api.com/api'; // Production (change this later)

// XP & Leveling Configuration
export const XP_CONFIG = {
  // XP required for each level (exponential growth)
  xpForLevel: (level) => Math.floor(100 * Math.pow(1.5, level - 1)),

  // Combo multipliers based on streak days, mirrors backend utils/combo.js
  comboMultipliers: {
    0: 1.0,
    3: 1.1,
    7: 1.2,
    14: 1.35,
    30: 1.5,
  },
};

export const APP_CONFIG = {
  name: 'LifeQuest',
  version: '1.0.0',
};
