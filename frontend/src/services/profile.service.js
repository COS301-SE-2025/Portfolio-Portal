import api from './api.service';

export const profileService = {
  getProfile: () => api.get('/users/me'),
  
  updateProfile: (token, data) => {
    return api.put('/users/me/profile', data, {
    });
  },
  
  uploadProfilePicture: (formData, config = {}) => {
    console.log('Sending FormData:', [...formData.entries()]);
    return api.post('/users/me/profile-picture', formData, {
      headers: {
        ...config.headers
      }
    });
  },
  
  getProfilePictureUrl: () => api.get('/users/me/profile-picture'),

  deleteProfile: (token) => {
    return api.delete('/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};