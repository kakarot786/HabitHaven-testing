import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const groupService = {
  createGroup: async (groupData) => {
    const result = await apiService.post(API_ENDPOINTS.GROUP.CREATE, groupData);
    return result;
  },

  joinGroup: async (groupId) => {
    if (!groupId) {
      return { success: false, error: 'Group ID is required' };
    }
    
    const result = await apiService.post(API_ENDPOINTS.GROUP.JOIN(groupId));
    return result;
  },

  getAllGroups: async () => {
    const result = await apiService.get(API_ENDPOINTS.GROUP.GET_ALL);
    
    if (result.success) {
      const groups = result.data?.message || result.data?.data || [];
      return { 
        success: true, 
        data: Array.isArray(groups) ? groups : [] 
      };
    }
    
    if (result.error?.includes('404') || result.error?.includes('not found')) {
      return { success: true, data: [] };
    }
    
    return result;
  },

  getMyGroups: async () => {
    const result = await apiService.get(API_ENDPOINTS.GROUP.GET_MY_GROUPS);
    
    if (result.success) {
      const groups = result.data?.message || result.data?.data || [];
      return { 
        success: true, 
        data: Array.isArray(groups) ? groups : [] 
      };
    }
    
    if (result.error?.includes('404') || result.error?.includes('not found')) {
      return { success: true, data: [] };
    }
    
    return result;
  },

  getGroupById: async (groupId) => {
    if (!groupId) {
      return { success: false, error: 'Group ID is required' };
    }
    
    const result = await apiService.get(API_ENDPOINTS.GROUP.GET_BY_ID(groupId));
    return result;
  },
};

export default groupService;