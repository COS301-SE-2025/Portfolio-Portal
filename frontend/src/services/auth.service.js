import api from './api.service';

export const authService = {
  signUp: (formData) => {
    return api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },  login: (credentials) => api.post('/users/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
  },
};

