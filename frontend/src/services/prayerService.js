import { apiService } from '../api';
import { API_ENDPOINTS } from '../constants';

export const prayerService = {
  logPrayers: async () => {
    const result = await apiService.post('/prayer/prayers');
    
    if (result.success) {
      const prayerData = result.data?.message || result.data?.data || [];
      const normalizedData = Array.isArray(prayerData) ? prayerData.map(prayer => ({
        _id: prayer._id || prayer.id,
        prayerName: prayer.prayerName || prayer.name || prayer.prayer_name || prayer.type,
        isCompleted: prayer.isCompleted || prayer.completed || prayer.is_completed || false,
        completedAt: prayer.completedAt || prayer.completed_at || prayer.completionTime,
        date: prayer.date || prayer.prayer_date || new Date().toISOString().split('T')[0]
      })) : [];
      
      return { success: true, data: normalizedData };
    }
    
    return result;
  },

  getTodaysPrayers: async () => {
    const result = await apiService.get('/prayer/prayers/today');
    
    if (result.success) {
      const prayerData = result.data?.message || result.data?.data || [];
      const normalizedData = Array.isArray(prayerData) ? prayerData.map(prayer => ({
        _id: prayer._id || prayer.id,
        prayerName: prayer.prayerName || prayer.name || prayer.prayer_name || prayer.type,
        isCompleted: prayer.isCompleted || prayer.completed || prayer.is_completed || false,
        completedAt: prayer.completedAt || prayer.completed_at || prayer.completionTime,
        date: prayer.date || prayer.prayer_date || new Date().toISOString().split('T')[0]
      })) : [];
      
      return { success: true, data: normalizedData };
    }
    
    if (result.error?.includes('404') || result.error?.includes('not found')) {
      return { success: false, error: 'No prayers found for today', needsCreation: true };
    }
    
    return result;
  },

  togglePrayerStatus: async (prayerId) => {
    if (!prayerId) {
      return { success: false, error: 'Prayer ID is required' };
    }

    const result = await apiService.post(`/prayer/${prayerId}/complete`);
    
    if (result.success) {
      const responseData = result.data?.message || result.data?.data || result.data;
      return { success: true, data: responseData };
    }
    
    return result;
  },
};

export default prayerService;