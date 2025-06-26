// cvDataService.js
import api from './api.service';

export const cvDataService = {
  // Profile operations (updated to match your backend routes)
  getProfile: (userId) => api.get(`/profile/${userId}`),
  createProfile: (userData) => api.post('/profile/register', userData),
  updateProfile: (profileData) => api.post('/profile/update', profileData),
  deleteProfile: (userId) => api.post(`/profile/delete/${userId}`),

  // Links operations (updated to match your backend routes)
  getUserLinks: (userId) => api.get(`/${userId}/links`),
  createUserLinks: (userId, linksData) => api.post(`/${userId}/links`, linksData),
  updateUserLinks: (userId, linksData) => api.put(`/${userId}/links`, linksData),
  deleteUserLinks: (userId) => api.delete(`/${userId}/links`),

  // About section operations (updated to match your backend routes)
  getUserAbout: (userId) => api.get(`/${userId}/about`),
  createUserAbout: (userId, aboutData) => api.post(`/${userId}/about`, aboutData),
  updateUserAbout: (userId, aboutData) => api.put(`/${userId}/about`, aboutData),
  deleteUserAbout: (userId) => api.delete(`/${userId}/about`),

  // Skills operations (updated to match your backend routes)
  getUserSkills: (userId) => api.get(`/${userId}/skills`),
  createUserSkills: (userId, skillsData) => api.post(`/${userId}/skills`, skillsData),
  updateUserSkills: (userId, skillsData) => api.put(`/${userId}/skills`, skillsData),
  deleteUserSkills: (userId) => api.delete(`/${userId}/skills`),

  // Education operations (updated to match your backend routes)
  getUserEducation: (userId) => api.get(`/${userId}/education`),
  createEducation: (userId, educationData) => api.post(`/${userId}/education`, educationData),
  getEducationById: (eduId) => api.get(`/education/${eduId}`),
  updateEducation: (eduId, educationData) => api.put(`/education/${eduId}`, educationData),
  deleteEducation: (eduId) => api.delete(`/education/${eduId}`),

  // Experience operations (updated to match your backend routes)
  getUserExperience: (userId) => api.get(`/${userId}/experience`),
  createExperience: (userId, experienceData) => api.post(`/${userId}/experience`, experienceData),
  getExperienceById: (expId) => api.get(`/experience/${expId}`),
  updateExperience: (expId, experienceData) => api.put(`/experience/${expId}`, experienceData),
  deleteExperience: (expId) => api.delete(`/experience/${expId}`),

  // Certifications operations (updated to match your backend routes)
  getUserCertifications: (userId) => api.get(`/${userId}/certifications`),
  createUserCertifications: (userId, certificationsData) => api.post(`/${userId}/certifications`, certificationsData),
  updateUserCertifications: (userId, certificationsData) => api.put(`/${userId}/certifications`, certificationsData),
  deleteUserCertifications: (userId) => api.delete(`/${userId}/certifications`),

  // References operations (updated to match your backend routes)
  getUserReferences: (userId) => api.get(`/${userId}/references`),
  createReference: (userId, referenceData) => api.post(`/${userId}/references`, referenceData),
  getReferenceById: (refId) => api.get(`/references/${refId}`),
  updateReference: (refId, referenceData) => api.put(`/references/${refId}`, referenceData),
  deleteReference: (refId) => api.delete(`/references/${refId}`),

  // Token management helpers (keeping existing localStorage functionality)
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
  }
};

// Enhanced auth service (updated to use profile endpoints)
export const authService = {
  register: (userData) => cvDataService.createProfile(userData),
  
  login: async (credentials) => {
    try {
      // Assuming you have a login endpoint, or this might be part of profile creation
      const response = await api.post('/auth/login', credentials);
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
        // If you have a logout endpoint, add it here
        // await api.post('/auth/logout', { token });
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
  }
};

// Export default for backward compatibility
export default cvDataService;