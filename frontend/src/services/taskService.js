import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const taskService = {
  createTask: async (taskData) => {
    const result = await apiService.post(API_ENDPOINTS.TASK.CREATE, taskData);
    if (result.success) {
      return { success: true, data: result.data?.data };
    }
    return result;
  },

  getAllTasks: async () => {
    const result = await apiService.get(API_ENDPOINTS.TASK.GET_ALL);
    
    if (result.success) {
      const tasksData = result.data?.data || [];
      return { success: true, data: Array.isArray(tasksData) ? tasksData : [] };
    }
    
    return result;
  },

  getCompletedTasks: async () => {
    const result = await apiService.get('/task/history');
    
    if (result.success) {
      const tasksData = result.data?.data || [];
      return { success: true, data: Array.isArray(tasksData) ? tasksData : [] };
    }
    
    return result;
  },

  getTaskById: async (taskId) => {
    const result = await apiService.get(API_ENDPOINTS.TASK.GET_BY_ID(taskId));
    if (result.success) {
      return { success: true, data: result.data?.data };
    }
    return result;
  },

  updateTask: async (taskId, updateData) => {
    const result = await apiService.put(
      API_ENDPOINTS.TASK.UPDATE(taskId),
      updateData
    );
    if (result.success) {
      return { success: true, data: result.data?.data };
    }
    return result;
  },

  deleteTask: async (taskId) => {
    const result = await apiService.delete(API_ENDPOINTS.TASK.DELETE(taskId));
    return result;
  },

  // Mark today's progress as complete
  markDayComplete: async (taskId) => {
    const result = await apiService.post(`/task/day/${taskId}/complete`);
    if (result.success) {
      return { 
        success: true, 
        data: result.data?.data,
        message: result.data?.message 
      };
    }
    return result;
  },

  // Legacy method for backwards compatibility
  markTaskComplete: async (taskId, isCompleted = true) => {
    const result = await apiService.put(
      API_ENDPOINTS.TASK.MARK_COMPLETE(taskId),
      { isCompleted }
    );
    if (result.success) {
      return { success: true, data: result.data?.data };
    }
    return result;
  },
};

export default taskService;