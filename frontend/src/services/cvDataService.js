// cvDataService.js
import api from './api.service';

export const cvDataService = {
  // Profile operations (updated to match your backend routes)
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  createProfile: (userData) => api.post('/users/profile/register', userData),
  updateProfile: (userId, profileData) => api.put(`/users/profile/update/${userId}`, profileData),
  deleteProfile: (userId) => api.delete(`/users/profile/delete/${userId}`),

  // Links operations (updated to match your backend routes)
  getUserLinks: (userId) => api.get(`users/${userId}/links`),
  createUserLinks: (userId, linksData) => api.post(`/users/${userId}/links`, linksData),
  updateUserLinks: (userId, linksData) => api.put(`/users/${userId}/links`, linksData),
  deleteUserLinks: (userId) => api.delete(`/users/${userId}/links`),

  // About section operations (updated to match your backend routes)
  getUserAbout: (userId) => api.get(`/users/${userId}/about`),
  createUserAbout: (userId, aboutData) => api.post(`/users/${userId}/about`, aboutData),
  updateUserAbout: (userId, aboutData) => api.put(`/users/${userId}/about`, aboutData),
  deleteUserAbout: (userId) => api.delete(`/users/${userId}/about`),

  // Skills operations (updated to match your backend routes)
  getUserSkills: (userId) => api.get(`/users/${userId}/skills`),
  createUserSkills: (userId, skillsData) => api.post(`/users/${userId}/skills`, skillsData),
  updateUserSkills: (userId, skillsData) => api.put(`/users/${userId}/skills`, skillsData),
  deleteUserSkills: (userId) => api.delete(`/users/${userId}/skills`),

  // Education operations (updated to match your backend routes)
  getUserEducation: (userId) => api.get(`/users/${userId}/education`),
  createEducation: (userId, educationData) => api.post(`/users/${userId}/education`, educationData),
  getEducationById: (eduId) => api.get(`/users/education/${eduId}`),
  updateEducation: (eduId, educationData) => api.put(`/users/education/${eduId}`, educationData),
  deleteEducation: (eduId) => api.delete(`/users/education/${eduId}`),

  // Experience operations (updated to match your backend routes)
  getUserExperience: (userId) => api.get(`/users/${userId}/experience`),
  createExperience: (userId, experienceData) => api.post(`/users/${userId}/experience`, experienceData),
  getExperienceById: (expId) => api.get(`/users/experience/${expId}`),
  updateExperience: (expId, experienceData) => api.put(`/users/experience/${expId}`, experienceData),
  deleteExperience: (expId) => api.delete(`/users/experience/${expId}`),

  // Certifications operations (updated to match your backend routes)
  getUserCertifications: (userId) => api.get(`/users/${userId}/certifications`),
  createUserCertifications: (userId, certificationsData) => api.post(`/users/${userId}/certifications`, certificationsData),
  updateUserCertifications: (userId, certificationsData) => api.put(`/users/${userId}/certifications`, certificationsData),
  deleteUserCertifications: (userId) => api.delete(`/users/${userId}/certifications`),

  // References operations (updated to match your backend routes)
  getUserReferences: (userId) => api.get(`/users/${userId}/references`),
  createReference: (userId, referenceData) => api.post(`/users/${userId}/references`, referenceData),
  getReferenceById: (refId) => api.get(`/users/references/${refId}`),
  updateReference: (refId, referenceData) => api.put(`/users/references/${refId}`, referenceData),
  deleteReference: (refId) => api.delete(`/users/references/${refId}`),
  
  // Complete profile operation
  getCompleteProfile: (userId) => api.get(`/users/${userId}/profile`),
  
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