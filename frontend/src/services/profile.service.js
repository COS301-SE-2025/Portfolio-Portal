import api from './api.service';

export const profileService = {
  getProfile: (token) => api.get('/users/me', token),
  updateProfile: (token, data) => api.put('/users/me/profile', data, token)
};