const mongoose = require('mongoose');

const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
      default: 30,
    },

    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 2,
    },

    // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    schedule: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6],
    },

    // Przypomnienie (lokalne powiadomienie na telefonie)
    reminderEnabled: {
      type: Boolean,
      default: false,
    },

    // Godzina przypomnienia w formacie "HH:MM" (np. "07:00")
    reminderTime: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

questSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Quest', questSchema);
