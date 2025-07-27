import api from './api.service';

export const profileService = {
  getProfile: (token) => api.get('/users/me', token),
  updateProfile: (token, data) => api.put('/users/me/profile', data, token),
  uploadProfilePicture: (token, file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    return api.post('/users/me/profile-picture', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

};