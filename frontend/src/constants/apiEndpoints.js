export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user/login',
    REGISTER: '/user/register',
    LOGOUT: '/user/logout',
    MY_ACCOUNT: '/user/my-account',
    UPDATE_ACCOUNT: '/user/update-account',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  TASK: {
    CREATE: '/task/createTask',
    GET_ALL: '/task/allTask',
    GET_BY_ID: (id) => `/task/${id}`,
    UPDATE: (id) => `/task/update/${id}`,
    DELETE: (id) => `/task/delete/${id}`,
    MARK_COMPLETE: (id) => `/task/complete/${id}`,
  },
  
  GROUP: {
    CREATE: '/group/createGroup',
    JOIN: (id) => `/group/${id}/join`,
    GET_ALL: '/group/allGroups',
    GET_MY_GROUPS: '/group/myGroups',
    GET_BY_ID: (id) => `/group/${id}`,
  },
  
  PRAYER: {
    LOG_PRAYERS: '/prayer/prayers',
    GET_TODAYS_PRAYERS: '/prayer/prayers/today',
    TOGGLE_COMPLETE: (id) => `/prayer/${id}/complete`,
    GET_TIMES: '/prayer/prayer-times',
    GET_BY_LOCATION: '/prayer/by-location',
  },
  
  CHALLENGE: {
    CREATE: '/challenge/create',
    JOIN: (id) => `/challenge/join/${id}`,
    UPDATE_PROGRESS: (id) => `/challenge/${id}/progress`,
    GET_MY_CHALLENGES: '/challenge/my-challenges',
    GET_DETAILS: (id) => `/challenge/${id}/detail`,
  },
};

export default API_ENDPOINTS;
