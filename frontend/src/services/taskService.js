import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const taskService = {
  createTask: async (taskData) => {
    const result = await apiService.post(API_ENDPOINTS.TASK.CREATE, taskData);
    return result;
  },

  getAllTasks: async () => {
    const result = await apiService.get(API_ENDPOINTS.TASK.GET_ALL);
    
    if (result.success) {
      const tasks = Array.isArray(result.data?.message) 
        ? result.data.message.map(task => ({
            _id: task._id || task.id,
            id: task._id || task.id,
            userId: task.userId,
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
            date: task.date,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          }))
        : result.data?.data || [];
      
      return { success: true, data: tasks };
    }
    
    return result;
  },

  getTaskById: async (taskId) => {
    const result = await apiService.get(API_ENDPOINTS.TASK.GET_BY_ID(taskId));
    return result;
  },

  updateTask: async (taskId, updateData) => {
    const result = await apiService.put(
      API_ENDPOINTS.TASK.UPDATE(taskId),
      updateData
    );
    return result;
  },

  deleteTask: async (taskId) => {
    const result = await apiService.delete(API_ENDPOINTS.TASK.DELETE(taskId));
    return result;
  },

  markTaskComplete: async (taskId, isCompleted = true) => {
    const result = await apiService.put(
      API_ENDPOINTS.TASK.MARK_COMPLETE(taskId),
      { isCompleted }
    );
    return result;
  },
};

export default taskService;