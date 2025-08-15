import api from './api.service';

export const profileService = {
  getProfile: () => api.get('/users/me'),
  
  updateProfile: (data) => api.put('/users/me/profile', data),
  
  uploadProfilePicture: (formData, config = {}) => {
    console.log('Sending FormData:', [...formData.entries()]); // Debug
    return api.post('/users/me/profile-picture', formData, {
      headers: {
        ...config.headers,
        // Ensure Authorization is included if not set by api.service
      }
    });
  },
  
  getProfilePictureUrl: () => api.get('/users/me/profile-picture')
};