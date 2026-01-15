import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const challengeService = {
  createChallenge: async (challengeData) => {
    const result = await apiService.post(API_ENDPOINTS.CHALLENGE.CREATE, challengeData);
    return result;
  },

  joinChallenge: async (challengeId) => {
    if (!challengeId) {
      return { success: false, error: 'Challenge ID is required' };
    }
    
    const result = await apiService.post(API_ENDPOINTS.CHALLENGE.JOIN(challengeId));
    return result;
  },

  updateProgress: async (challengeId) => {
    if (!challengeId) {
      return { success: false, error: 'Challenge ID is required' };
    }
    
    const result = await apiService.patch(API_ENDPOINTS.CHALLENGE.UPDATE_PROGRESS(challengeId));
    return result;
  },

  getMyChallenges: async () => {
    const result = await apiService.get(API_ENDPOINTS.CHALLENGE.GET_MY_CHALLENGES);
    
    if (result.success) {
      const challenges = result.data?.message || result.data?.data || [];
      return { 
        success: true, 
        data: Array.isArray(challenges) ? challenges : [] 
      };
    }
    
    if (result.error?.includes('404') || result.error?.includes('not found')) {
      return { success: true, data: [] };
    }
    
    return result;
  },

  getChallengeDetails: async (challengeId) => {
    if (!challengeId) {
      return { success: false, error: 'Challenge ID is required' };
    }
    
    const result = await apiService.get(API_ENDPOINTS.CHALLENGE.GET_DETAILS(challengeId));
    return result;
  },
};

export default challengeService;
