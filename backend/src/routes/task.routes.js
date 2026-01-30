import express from "express";
import { Router } from "express";
import { createTask, deleteTask, getAllTasks, getCompletedTasks, getTaskById, markTaskComplete, markDayComplete, updateTask } from "../controllers/task.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const taskRouter = Router();

// Create a new task/habit
taskRouter.route("/createTask").post(verifyJwt, createTask);

// Get all active tasks
taskRouter.route("/allTask").get(verifyJwt, getAllTasks);

// Get completed tasks (history)
taskRouter.route("/history").get(verifyJwt, getCompletedTasks);

// Get single task
taskRouter.route("/:id").get(verifyJwt, getTaskById);

// Update task
taskRouter.route("/update/:id").put(verifyJwt, updateTask);

// Delete task
taskRouter.route("/delete/:id").delete(verifyJwt, deleteTask);

// Mark today's progress as complete
taskRouter.route("/day/:id/complete").post(verifyJwt, markDayComplete);

// Legacy endpoint for backwards compatibility
taskRouter.put("/complete/:id", verifyJwt, markTaskComplete);

export default taskRouter;
