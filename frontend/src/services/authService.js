import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const authService = {
  login: async (email, password) => {
    const result = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    
    if (result.success) {
      let user, accessToken;
      const data = result.data;
      
      if (data.data && typeof data.data === 'object') {
        user = data.data.user;
        accessToken = data.data.accessToken;
      } else if (data.user && data.accessToken) {
        user = data.user;
        accessToken = data.accessToken;
      } else if (data.message && typeof data.message === 'object' && data.message.user && data.message.accessToken) {
        user = data.message.user;
        accessToken = data.message.accessToken;
      }
      
      if (accessToken && user) {
        return { success: true, user, accessToken };
      } else {
        console.error('authService - Missing authentication data. Data structure:', data);
        return { 
          success: false, 
          error: 'Missing authentication data in response' 
        };
      }
    }
    
    return result;
  },

  register: async (userData) => {
    const result = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return result;
  },

  logout: async () => {
    const result = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    return result;
  },

  getCurrentUser: async () => {
    const result = await apiService.get(API_ENDPOINTS.AUTH.MY_ACCOUNT);
    return result;
  },

  updateAccount: async (updateData) => {
    const result = await apiService.post(
      API_ENDPOINTS.AUTH.UPDATE_ACCOUNT,
      updateData
    );
    return result;
  },

  changePassword: async (oldPassword, newPassword) => {
    const result = await apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
    return result;
  },
};

export default authService;
