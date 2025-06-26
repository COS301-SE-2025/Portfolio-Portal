// cvDataService.js
import api from './api.service';

export const cvDataService = {
  // Authentication operations
  createUser: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: (token) => api.post('/auth/logout', { token }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refresh_token: refreshToken }),

  // User operations
  getUser: (userId) => api.get(`/users/${userId}`),

  // Links operations
  getLinks: (userId) => api.get(`/links/user/${userId}`),
  createLinks: (userId, linksData) => api.post('/links', { user_id: userId, ...linksData }),
  updateLinks: (userId, linksData) => api.put(`/links/user/${userId}`, linksData),
  deleteLinks: (userId) => api.delete(`/links/user/${userId}`),

  // About section operations
  getAbout: (userId) => api.get(`/about/user/${userId}`),
  createAbout: (userId, paragraphs) => api.post('/about', { user_id: userId, paragraphs }),
  updateAbout: (userId, paragraphs) => api.put(`/about/user/${userId}`, { paragraphs }),
  deleteAbout: (userId) => api.delete(`/about/user/${userId}`),

  // Skills operations
  getSkills: (userId) => api.get(`/skills/user/${userId}`),
  createSkills: (userId, skillsList) => api.post('/skills', { user_id: userId, skills_list: skillsList }),
  updateSkills: (userId, skillsList) => api.put(`/skills/user/${userId}`, { skills_list: skillsList }),
  deleteSkills: (userId) => api.delete(`/skills/user/${userId}`),

  // Education operations
  getEducation: (userId) => api.get(`/education/user/${userId}`),
  createEducation: (userId, educationData) => api.post('/education', { user_id: userId, ...educationData }),
  getEducationById: (id) => api.get(`/education/${id}`),
  updateEducation: (id, educationData) => api.put(`/education/${id}`, educationData),
  deleteEducation: (id) => api.delete(`/education/${id}`),

  // Experience operations
  getExperience: (userId) => api.get(`/experience/user/${userId}`),
  createExperience: (userId, experienceData) => api.post('/experience', { user_id: userId, ...experienceData }),
  getExperienceById: (id) => api.get(`/experience/${id}`),
  updateExperience: (id, experienceData) => api.put(`/experience/${id}`, experienceData),
  deleteExperience: (id) => api.delete(`/experience/${id}`),

  // Certifications operations
  getCertifications: (userId) => api.get(`/certifications/user/${userId}`),
  createCertifications: (userId, certificationsList) => api.post('/certifications', { user_id: userId, certifications_list: certificationsList }),
  updateCertifications: (userId, certificationsList) => api.put(`/certifications/user/${userId}`, { certifications_list: certificationsList }),
  deleteCertifications: (userId) => api.delete(`/certifications/user/${userId}`),

  // References operations
  getReferences: (userId) => api.get(`/references/user/${userId}`),
  createReference: (userId, referenceData) => api.post('/references', { user_id: userId, ...referenceData }),
  getReferenceById: (id) => api.get(`/references/${id}`),
  updateReference: (id, referenceData) => api.put(`/references/${id}`, referenceData),
  deleteReference: (id) => api.delete(`/references/${id}`),

  // Complete portfolio operations
  getCompletePortfolio: (userId) => api.get(`/portfolio/complete/${userId}`),

  // Token management helpers
  setToken: (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  setRefreshToken: (refreshToken) => {
    localStorage.setItem('refresh_token', refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tokenTimestamp');
  },

  isTokenExpired: () => {
    const timestamp = localStorage.getItem('tokenTimestamp');
    if (!timestamp) return true;
    
    // Check if token is older than 1 hour (3600000 ms)
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - parseInt(timestamp)) > oneHour;
  },

  // Auto-refresh token if needed
  ensureValidToken: async () => {
    const token = cvDataService.getToken();
    const refreshToken = cvDataService.getRefreshToken();
    
    if (!token || !refreshToken) {
      throw new Error('No authentication tokens found');
    }

    if (cvDataService.isTokenExpired()) {
      try {
        const response = await cvDataService.refreshToken(refreshToken);
        cvDataService.setToken(response.data.token);
        cvDataService.setRefreshToken(response.data.refresh_token);
        return response.data.token;
      } catch (error) {
        cvDataService.clearTokens();
        throw new Error('Token refresh failed');
      }
    }

    return token;
  }
};

// Enhanced auth service with better token management
export const authService = {
  register: (userData) => cvDataService.createUser(userData),
  
  login: async (credentials) => {
    try {
      const response = await cvDataService.login(credentials);
      const { token, refresh_token, expires_at, user } = response.data;
      
      cvDataService.setToken(token);
      cvDataService.setRefreshToken(refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const token = cvDataService.getToken();
      if (token) {
        await cvDataService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      cvDataService.clearTokens();
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!cvDataService.getToken() && !cvDataService.isTokenExpired();
  },

  refreshSession: async () => {
    try {
      await cvDataService.ensureValidToken();
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Export default for backward compatibility
export default cvDataService;