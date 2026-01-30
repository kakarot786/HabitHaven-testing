import Task from "../models/task.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Helper to format date as YYYY-MM-DD
const formatDate = (date = new Date()) => date.toISOString().split("T")[0];

// Helper to generate daily progress array
const generateDailyProgress = (startDate, durationDays) => {
  const progress = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < durationDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    progress.push({
      date: formatDate(date),
      completed: false,
      completedAt: null
    });
  }
  
  return progress;
};

// Helper to calculate streak
const calculateStreak = (dailyProgress) => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort by date
  const sorted = [...dailyProgress].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  for (const day of sorted) {
    if (day.completed) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate current streak from today backwards
  const today = formatDate();
  const todayIndex = sorted.findIndex(d => d.date === today);
  
  if (todayIndex >= 0) {
    for (let i = todayIndex; i >= 0; i--) {
      if (sorted[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  return { currentStreak, longestStreak };
};

const createTask = asyncHandler(async (req, res, next) => {
  const { title, description, durationDays, category, icon, startDate } = req.body;
  
  if (!title || !durationDays) {
    throw new ApiError(400, "Title and duration are required");
  }
  
  const duration = parseInt(durationDays);
  if (isNaN(duration) || duration < 1) {
    throw new ApiError(400, "Duration must be at least 1 day");
  }
  
  const start = startDate ? new Date(startDate) : new Date();
  const startDateStr = formatDate(start);
  
  const end = new Date(start);
  end.setDate(end.getDate() + duration - 1);
  const endDateStr = formatDate(end);
  
  const dailyProgress = generateDailyProgress(startDateStr, duration);
  
  const task = await Task.create({
    userId: req.user.id,
    title,
    description: description || "",
    startDate: startDateStr,
    endDate: endDateStr,
    durationDays: duration,
    dailyProgress,
    category: category || 'other',
    icon: icon || 'target',
    date: start // Legacy field
  });
  
  return res.status(201).json(new ApiResponse(201, task, "Habit created successfully"));
});

const getAllTasks = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  // Get active (non-completed) tasks
  const tasks = await Task.find({ userId, isCompleted: false });
  
  return res.status(200).json(
    new ApiResponse(200, tasks, "Tasks fetched successfully")
  );
});

const getCompletedTasks = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  
  // Get completed tasks (history)
  const tasks = await Task.find({ userId, isCompleted: true })
    .sort({ completedAt: -1 });
  
  return res.status(200).json(
    new ApiResponse(200, tasks, "Completed tasks fetched successfully")
  );
});

const getTaskById = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }
  
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, category, icon } = req.body;
  
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }
  
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  // Don't allow editing completed tasks
  if (task.isCompleted) {
    throw new ApiError(400, "Cannot edit a completed habit");
  }
  
  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (category) task.category = category;
  if (icon) task.icon = icon;
  
  await task.save();
  
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }
  
  const task = await Task.findOneAndDelete({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  return res.status(200).json(new ApiResponse(200, null, "Task deleted successfully"));
});

// Mark today's task as complete
const markDayComplete = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const today = formatDate();
  
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }
  
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(404, "Task not found or you are not authorized");
  }
  
  if (task.isCompleted) {
    throw new ApiError(400, "This habit is already completed");
  }
  
  // Find today's progress
  const dayIndex = task.dailyProgress.findIndex(d => d.date === today);
  
  if (dayIndex === -1) {
    throw new ApiError(400, "Today is not within the habit duration");
  }
  
  // Only allow marking today - no going back to previous days
  const dayProgress = task.dailyProgress[dayIndex];
  
  // Toggle today's completion
  if (!dayProgress.completed) {
    task.dailyProgress[dayIndex].completed = true;
    task.dailyProgress[dayIndex].completedAt = new Date();
  } else {
    // Can only untick today, not previous days
    task.dailyProgress[dayIndex].completed = false;
    task.dailyProgress[dayIndex].completedAt = null;
  }
  
  // Recalculate streaks
  const { currentStreak, longestStreak } = calculateStreak(task.dailyProgress);
  task.currentStreak = currentStreak;
  task.longestStreak = Math.max(task.longestStreak, longestStreak);
  
  // Check if all days are completed
  const allCompleted = task.dailyProgress.every(d => d.completed);
  if (allCompleted) {
    task.isCompleted = true;
    task.completedAt = new Date();
  }
  
  await task.save();
  
  return res.status(200).json(
    new ApiResponse(200, task, allCompleted ? "🎉 Congratulations! Habit completed!" : "Progress updated successfully")
  );
});

// Legacy endpoint for backwards compatibility
const markTaskComplete = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user._id || req.user.id;
  
  if (!taskId) {
    throw new ApiError(400, "Task ID is required");
  }
  
  const task = await Task.findOne({ _id: taskId, userId });
  if (!task) {
    throw new ApiError(404, "Task not found or you are not authorized");
  }
  
  // Use the new day-based completion
  const today = formatDate();
  const dayIndex = task.dailyProgress.findIndex(d => d.date === today);
  
  if (dayIndex >= 0) {
    const isCompleted = req.body.isCompleted ?? true;
    task.dailyProgress[dayIndex].completed = isCompleted;
    task.dailyProgress[dayIndex].completedAt = isCompleted ? new Date() : null;
    
    // Recalculate streaks
    const { currentStreak, longestStreak } = calculateStreak(task.dailyProgress);
    task.currentStreak = currentStreak;
    task.longestStreak = Math.max(task.longestStreak, longestStreak);
    
    // Check if all days are completed
    const allCompleted = task.dailyProgress.every(d => d.completed);
    if (allCompleted) {
      task.isCompleted = true;
      task.completedAt = new Date();
    } else {
      task.isCompleted = false;
      task.completedAt = null;
    }
  }
  
  await task.save();
  
  return res.status(200).json(new ApiResponse(200, task, "Task updated successfully"));
});

export { 
  createTask, 
  getAllTasks, 
  getCompletedTasks,
  getTaskById, 
  updateTask, 
  deleteTask, 
  markTaskComplete,
  markDayComplete 
};