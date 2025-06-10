import api from './api.service';

export const authService = {
  signUp: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
  },
};
