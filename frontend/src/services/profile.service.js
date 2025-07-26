import api from './api.service';

export const profileService = {
  getProfile: (token) => api.get('/users/me', token)
};

