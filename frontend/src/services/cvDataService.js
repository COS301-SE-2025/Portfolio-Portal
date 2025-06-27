// services/cvDataService.js
import api from './api.service';

class CVDataService {
  constructor() {
    this.data = null;
    this.listeners = [];
  }

  // ==== Backend API Operations ====

  // Profile
  getProfile = (userId) => api.get(`/users/profile/${userId}`);
  createProfile = (userData) => api.post('/users/profile/register', userData);
  updateProfile = (userId, profileData) => api.put(`/users/profile/update/${userId}`, profileData);
  deleteProfile = (userId) => api.delete(`/users/profile/delete/${userId}`);

  // Links
  getUserLinks = (userId) => api.get(`users/${userId}/links`);
  createUserLinks = (userId, linksData) => api.post(`/users/${userId}/links`, linksData);
  updateUserLinks = (userId, linksData) => api.put(`/users/${userId}/links`, linksData);
  deleteUserLinks = (userId) => api.delete(`/users/${userId}/links`);

  // About
  getUserAbout = (userId) => api.get(`/users/${userId}/about`);
  createUserAbout = (userId, aboutData) => api.post(`/users/${userId}/about`, aboutData);
  updateUserAbout = (userId, aboutData) => api.put(`/users/${userId}/about`, aboutData);
  deleteUserAbout = (userId) => api.delete(`/users/${userId}/about`);

  // Skills
  getUserSkills = (userId) => api.get(`/users/${userId}/skills`);
  createUserSkills = (userId, skillsData) => api.post(`/users/${userId}/skills`, skillsData);
  updateUserSkills = (userId, skillsData) => api.put(`/users/${userId}/skills`, skillsData);
  deleteUserSkills = (userId) => api.delete(`/users/${userId}/skills`);

  // Education
  getUserEducation = (userId) => api.get(`/users/${userId}/education`);
  createEducation = (userId, educationData) => api.post(`/users/${userId}/education`, educationData);
  getEducationById = (eduId) => api.get(`/users/education/${eduId}`);
  updateEducation = (eduId, educationData) => api.put(`/users/education/${eduId}`, educationData);
  deleteEducation = (eduId) => api.delete(`/users/education/${eduId}`);

  // Experience
  getUserExperience = (userId) => api.get(`/users/${userId}/experience`);
  createExperience = (userId, experienceData) => api.post(`/users/${userId}/experience`, experienceData);
  getExperienceById = (expId) => api.get(`/users/experience/${expId}`);
  updateExperience = (expId, experienceData) => api.put(`/users/experience/${expId}`, experienceData);
  deleteExperience = (expId) => api.delete(`/users/experience/${expId}`);

  // Certifications
  getUserCertifications = (userId) => api.get(`/users/${userId}/certifications`);
  createUserCertifications = (userId, certsData) => api.post(`/users/${userId}/certifications`, certsData);
  updateUserCertifications = (userId, certsData) => api.put(`/users/${userId}/certifications`, certsData);
  deleteUserCertifications = (userId) => api.delete(`/users/${userId}/certifications`);

  // References
  getUserReferences = (userId) => api.get(`/users/${userId}/references`);
  createReference = (userId, referenceData) => api.post(`/users/${userId}/references`, referenceData);
  getReferenceById = (refId) => api.get(`/users/references/${refId}`);
  updateReference = (refId, referenceData) => api.put(`/users/references/${refId}`, referenceData);
  deleteReference = (refId) => api.delete(`/users/references/${refId}`);

  // Get complete profile
  getCompleteProfile = (userId) => api.get(`/users/${userId}/profile`);

  // ==== Token Management ====
  setToken = (token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenTimestamp', Date.now().toString());
  }

  getToken = () => localStorage.getItem('token');

  setRefreshToken = (refreshToken) => localStorage.setItem('refresh_token', refreshToken);

  getRefreshToken = () => localStorage.getItem('refresh_token');

  clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('tokenTimestamp');
  }

  isTokenExpired = () => {
    const timestamp = localStorage.getItem('tokenTimestamp');
    if (!timestamp) return true;
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - parseInt(timestamp)) > oneHour;
  }

  // ==== Local CV Data State ====
  setData(cvData) {
    this.data = cvData;
    this.notifyListeners();
    try {
      sessionStorage.setItem('cvData', JSON.stringify(cvData));
    } catch (err) {
      console.warn('Could not store data in sessionStorage:', err);
    }
  }

  getData() {
    if (!this.data) {
      try {
        const stored = sessionStorage.getItem('cvData');
        if (stored) this.data = JSON.parse(stored);
      } catch (err) {
        console.warn('Could not load from sessionStorage:', err);
      }
    }
    return this.data;
  }

  hasData() {
    return this.getData() !== null;
  }

  clearData() {
    this.data = null;
    try {
      sessionStorage.removeItem('cvData');
    } catch (err) {
      console.warn('Could not clear sessionStorage:', err);
    }
    this.notifyListeners();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.data));
  }

  // Convenience Getters
  getName = () => this.getData()?.name || '';
  getEmail = () => this.getData()?.email || '';
  getPhone = () => this.getData()?.phone || '';
  getAbout = () => this.getData()?.about || [];
  getSkills = () => this.getData()?.skills || [];
  getExperience = () => this.getData()?.experience || [];
  getEducation = () => this.getData()?.education || [];
  getCertifications = () => this.getData()?.certifications || [];
  getLinks = () => this.getData()?.links || {};
  getReferences = () => this.getData()?.references || [];
}

// Singleton instance
const cvDataService = new CVDataService();

// Auth service based on cvDataService
export const authService = {
  register: (userData) => cvDataService.createProfile(userData),

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, refresh_token, user } = response.data;
    cvDataService.setToken(token);
    cvDataService.setRefreshToken(refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    return response;
  },

  logout: async () => {
    try {
      const token = cvDataService.getToken();
      if (token) {
        // Optional logout endpoint
        // await api.post('/auth/logout', { token });
      }
    } catch (err) {
      console.error('Logout error:', err);
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

// Export
export default cvDataService;
