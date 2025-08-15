import api from './api.service';

export const profileService = {
  getProfile: () => api.get('/users/me'),
  
  updateProfile: (data) => api.put('/users/me/profile', data),
  
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post('/users/me/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getProfilePictureUrl: () => api.get('/users/me/profile-picture')
};