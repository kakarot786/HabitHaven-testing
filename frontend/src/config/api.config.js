const API_CONFIG = {
  // BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  BASE_URL: '',
  API_VERSION: '/api/v1',
  TIMEOUT: 15000,
};

// Construct full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};

export default API_CONFIG;
