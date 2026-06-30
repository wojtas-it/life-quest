# LifeQuest - Database Schema

> Complete MongoDB/Mongoose schema definitions

---

## 📊 Entity Relationship Diagram

```
┌──────────────┐
│    Users     │───────┐
│              │       │
│ - _id (PK)   │       │ 1
│ - username   │       │
│ - email      │       │
│ - password   │       │
│ - avatarUrl  │       │ N
│ - level      │       │
│ - totalXP    │       ├───> Quests
│ - createdAt  │       │     - userId (FK)
└──────────────┘       │
      │                │
      │ 1              │
      │                │
      │ 1              │
      ├───> UserStats  │
      │                │
      │ 1              │
      │                │
      ├───> SkillTrees │
      │     - userId (FK)
      │     - categoryId (FK)
      │                │
      │ M              │
      │                │
      └───> UserAchievements (junction)
            - userId (FK)
            - achievementId (FK)

┌──────────────┐
│  Categories  │
│              │
│ - _id (PK)   │─────> SkillTrees
│ - name       │       - categoryId (FK)
│ - icon       │
│ - color      │─────> Quests
└──────────────┘       - categoryId (FK)

┌──────────────┐
│ Achievements │
│              │
│ - _id (PK)   │─────> UserAchievements
│ - title      │       - achievementId (FK)
│ - condition  │
└──────────────┘
```

---

## 📋 Collections Overview

| Collection | Purpose | Relationships |
|------------|---------|---------------|
| **users** | User accounts & authentication | 1:N with quests, skillTrees; 1:1 with userStats; M:N with achievements |
| **quests** | User tasks/quests | N:1 with users, categories |
| **categories** | Quest categories (predefined) | 1:N with quests, skillTrees |
| **skillTrees** | User progress per category | N:1 with users, categories |
| **achievements** | Unlockable achievements | M:N with users (via userAchievements) |
| **userStats** | User statistics & streak data | 1:1 with users |
| **userAchievements** | Junction table for user-achievement relation | - |

---

## 1. Users Collection

### Schema Definition (Mongoose)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password in queries
    },

    avatarUrl: {
      type: String,
      default: 'https://via.placeholder.com/150', // Default avatar
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Additional fields for improvements
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto',
      },
      notifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        enum: ['pl', 'en'],
        default: 'pl',
      },
    },

    lastLoginDate: {
      type: Date,
      default: Date.now,
    },

    timezone: {
      type: String,
      default: 'Europe/Warsaw',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to calculate required XP for current level
userSchema.methods.getXPForLevel = function (level) {
  return Math.floor(100 * Math.pow(1.5, (level || this.level) - 1));
};

// Virtual for progress to next level
userSchema.virtual('levelProgress').get(function () {
  const currentLevelXP = this.getXPForLevel(this.level);
  const nextLevelXP = this.getXPForLevel(this.level + 1);
  const progress = ((this.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.max(0, Math.min(100, progress));
});

module.exports = mongoose.model('User', userSchema);
```

### Example Document

```json
{
  "_id": "ObjectId('...')",
  "username": "Filip_Quest",
  "email": "filip@example.com",
  "passwordHash": "$2a$10$...",
  "avatarUrl": "https://example.com/avatar.jpg",
  "level": 5,
  "totalXP": 850,
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "pl"
  },
  "lastLoginDate": "2026-05-11T10:30:00.000Z",
  "timezone": "Europe/Warsaw",
  "createdAt": "2026-03-15T08:00:00.000Z",
  "updatedAt": "2026-05-11T10:30:00.000Z"
}
```

---

## 2. Quests Collection

### Schema Definition

```javascript
const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for faster queries
    },

    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    xpReward: {
      type: Number,
      required: true,
      min: [10, 'XP reward must be at least 10'],
      max: [500, 'XP reward cannot exceed 500'],
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
    },

    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    // Additional fields for improvements
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 2,
    },

    tags: [{
      type: String,
      trim: true,
    }],

    recurringType: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },

    parentQuestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      default: null, // For sub-tasks
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
questSchema.index({ userId: 1, isCompleted: 1 });
questSchema.index({ userId: 1, dueDate: 1 });

// Virtual to check if quest is overdue
questSchema.virtual('isOverdue').get(function () {
  return !this.isCompleted && new Date() > this.dueDate;
});

module.exports = mongoose.model('Quest', questSchema);
```

### Example Document

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "title": "Przeczytać rozdział 3",
  "description": "Kontynuacja książki o React Native",
  "categoryId": "ObjectId('...')", // Intelekt
  "xpReward": 30,
  "isCompleted": false,
  "dueDate": "2026-05-12T20:00:00.000Z",
  "priority": "medium",
  "difficulty": 2,
  "tags": ["reading", "education"],
  "recurringType": "none",
  "createdAt": "2026-05-11T08:00:00.000Z",
  "updatedAt": "2026-05-11T08:00:00.000Z"
}
```

---

## 3. Categories Collection

### Schema Definition

```javascript
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    icon: {
      type: String, // Emoji or icon name
      required: true,
    },

    color: {
      type: String, // Hex color code
      required: true,
      match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color'],
    },

    description: {
      type: String,
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: true, // Predefined categories
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Category', categorySchema);
```

### Predefined Categories (Seed Data)

```javascript
const defaultCategories = [
  {
    name: 'Siła',
    icon: '💪',
    color: '#E63946',
    description: 'Aktywność fizyczna, trening, zdrowie',
    isDefault: true,
  },
  {
    name: 'Intelekt',
    icon: '🧠',
    color: '#457B9D',
    description: 'Nauka, czytanie, kursy, rozwój umysłu',
    isDefault: true,
  },
  {
    name: 'Produktywność',
    icon: '⚡',
    color: '#2A9D8F',
    description: 'Praca, projekty, organizacja',
    isDefault: true,
  },
  {
    name: 'Kreatywność',
    icon: '🎨',
    color: '#F4A261',
    description: 'Sztuka, muzyka, hobby twórcze',
    isDefault: true,
  },
];
```

---

## 4. SkillTrees Collection

### Schema Definition

```javascript
const skillTreeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },

    currentXP: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one skill tree per user per category
skillTreeSchema.index({ userId: 1, categoryId: 1 }, { unique: true });

// Method to calculate XP needed for next level
skillTreeSchema.methods.getXPForLevel = function (level) {
  return Math.floor(100 * Math.pow(1.5, (level || this.level) - 1));
};

// Method to check and handle level-up
skillTreeSchema.methods.checkLevelUp = function () {
  const xpNeeded = this.getXPForLevel(this.level + 1);
  if (this.currentXP >= xpNeeded) {
    this.level += 1;
    return true; // Leveled up
  }
  return false;
};

module.exports = mongoose.model('SkillTree', skillTreeSchema);
```

### Example Document

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "categoryId": "ObjectId('...')", // Intelekt
  "currentXP": 680,
  "level": 5,
  "createdAt": "2026-03-15T08:00:00.000Z",
  "updatedAt": "2026-05-11T10:30:00.000Z"
}
```

---

## 5. Achievements Collection

### Schema Definition

```javascript
const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String, // Emoji or icon name
      required: true,
    },

    condition: {
      type: String,
      required: true,
      // E.g., "complete_10_quests", "reach_level_10", "7_day_streak"
    },

    conditionValue: {
      type: Number,
      default: 1,
      // Threshold value for the condition
    },

    xpBonus: {
      type: Number,
      default: 50,
      min: 0,
    },

    category: {
      type: String,
      enum: ['general', 'strength', 'intelligence', 'productivity', 'creativity'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Achievement', achievementSchema);
```

### Predefined Achievements (Examples)

```javascript
const defaultAchievements = [
  {
    title: 'First Quest',
    description: 'Ukończ swój pierwszy quest',
    icon: '🎯',
    condition: 'complete_quests',
    conditionValue: 1,
    xpBonus: 50,
    category: 'general',
  },
  {
    title: 'Warrior',
    description: 'Ukończ 10 questów w kategorii Siła',
    icon: '💪',
    condition: 'category_quests_strength',
    conditionValue: 10,
    xpBonus: 100,
    category: 'strength',
  },
  {
    title: 'Scholar',
    description: 'Ukończ 10 questów w kategorii Intelekt',
    icon: '🎓',
    condition: 'category_quests_intelligence',
    conditionValue: 10,
    xpBonus: 100,
    category: 'intelligence',
  },
  {
    title: 'Week Warrior',
    description: 'Utrzymaj 7-dniowy streak',
    icon: '🔥',
    condition: 'streak_days',
    conditionValue: 7,
    xpBonus: 150,
    category: 'general',
  },
  {
    title: 'Level Master',
    description: 'Osiągnij poziom 10',
    icon: '⭐',
    condition: 'reach_level',
    conditionValue: 10,
    xpBonus: 200,
    category: 'general',
  },
];
```

---

## 6. UserStats Collection

### Schema Definition

```javascript
const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    questsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    comboMultiplier: {
      type: Number,
      default: 1.0,
      min: 1.0,
      max: 3.0,
    },

    lastActiveDate: {
      type: Date,
      default: Date.now,
    },

    // Additional stats
    totalXPEarned: {
      type: Number,
      default: 0,
    },

    questsCreated: {
      type: Number,
      default: 0,
    },

    achievementsUnlocked: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to update streak
userStatsSchema.methods.updateStreak = function () {
  const now = new Date();
  const lastActive = new Date(this.lastActiveDate);
  const hoursDiff = (now - lastActive) / (1000 * 60 * 60);

  if (hoursDiff <= 24) {
    // Within 24 hours - continue streak
    this.currentStreak += 1;
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
  } else if (hoursDiff <= 48) {
    // Missed a day but within grace period
    // Keep streak but don't increment
  } else {
    // Streak broken
    this.currentStreak = 1;
  }

  this.lastActiveDate = now;
  this.updateComboMultiplier();
};

// Method to calculate combo multiplier based on streak
userStatsSchema.methods.updateComboMultiplier = function () {
  const streak = this.currentStreak;

  if (streak >= 30) {
    this.comboMultiplier = 2.5;
  } else if (streak >= 14) {
    this.comboMultiplier = 2.0;
  } else if (streak >= 7) {
    this.comboMultiplier = 1.5;
  } else if (streak >= 3) {
    this.comboMultiplier = 1.2;
  } else {
    this.comboMultiplier = 1.0;
  }
};

module.exports = mongoose.model('UserStats', userStatsSchema);
```

### Example Document

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "questsCompleted": 42,
  "currentStreak": 6,
  "longestStreak": 14,
  "comboMultiplier": 1.2,
  "lastActiveDate": "2026-05-11T10:30:00.000Z",
  "totalXPEarned": 1850,
  "questsCreated": 58,
  "achievementsUnlocked": 5,
  "createdAt": "2026-03-15T08:00:00.000Z",
  "updatedAt": "2026-05-11T10:30:00.000Z"
}
```

---

## 7. UserAchievements Collection (Junction Table)

### Schema Definition

```javascript
const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      required: true,
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate unlocks
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
```

### Example Document

```json
{
  "_id": "ObjectId('...')",
  "userId": "ObjectId('...')",
  "achievementId": "ObjectId('...')",
  "unlockedAt": "2026-05-10T15:45:00.000Z",
  "createdAt": "2026-05-10T15:45:00.000Z",
  "updatedAt": "2026-05-10T15:45:00.000Z"
}
```

---

## 8. Indexes Summary

For optimal query performance:

```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Quests
db.quests.createIndex({ userId: 1, isCompleted: 1 });
db.quests.createIndex({ userId: 1, dueDate: 1 });
db.quests.createIndex({ categoryId: 1 });

// SkillTrees
db.skillTrees.createIndex({ userId: 1, categoryId: 1 }, { unique: true });

// UserStats
db.userStats.createIndex({ userId: 1 }, { unique: true });

// UserAchievements
db.userAchievements.createIndex({ userId: 1, achievementId: 1 }, { unique: true });
```

---

## 9. Sample Queries

### Get user's active quests
```javascript
const activeQuests = await Quest.find({
  userId: userId,
  isCompleted: false,
})
  .populate('categoryId')
  .sort({ dueDate: 1 });
```

### Get user's skill tree progress
```javascript
const skillTrees = await SkillTree.find({ userId })
  .populate('categoryId')
  .sort({ level: -1 });
```

### Check and unlock achievements
```javascript
const userStats = await UserStats.findOne({ userId });
const achievements = await Achievement.find({
  condition: 'complete_quests',
  conditionValue: { $lte: userStats.questsCompleted },
});

// Check which are not yet unlocked
const unlockedIds = await UserAchievement.find({ userId })
  .distinct('achievementId');

const newAchievements = achievements.filter(
  a => !unlockedIds.includes(a._id.toString())
);
```

---

**Document Version**: 1.0
**Last Updated**: May 11, 2026
