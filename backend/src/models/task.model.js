import mongoose from "mongoose";

const dailyProgressSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}, { _id: false });

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  // Habit tracking fields
  startDate: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  endDate: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  durationDays: {
    type: Number,
    required: true,
    min: 1
  },
  // Daily progress tracking
  dailyProgress: [dailyProgressSchema],
  // Overall completion status
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  // Category/color for visual distinction
  category: {
    type: String,
    enum: ['health', 'fitness', 'learning', 'mindfulness', 'productivity', 'social', 'creative', 'other'],
    default: 'other'
  },
  // Icon for the habit
  icon: {
    type: String,
    default: 'target'
  },
  // Streak tracking
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  // Legacy field for backwards compatibility
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Virtual to calculate completion percentage
taskSchema.virtual('completionPercentage').get(function() {
  if (!this.dailyProgress || this.dailyProgress.length === 0) return 0;
  const completed = this.dailyProgress.filter(d => d.completed).length;
  return Math.round((completed / this.dailyProgress.length) * 100);
});

// Virtual to get completed days count
taskSchema.virtual('completedDays').get(function() {
  if (!this.dailyProgress) return 0;
  return this.dailyProgress.filter(d => d.completed).length;
});

// Include virtuals in JSON
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

const Task = mongoose.model("Task", taskSchema);

export default Task;