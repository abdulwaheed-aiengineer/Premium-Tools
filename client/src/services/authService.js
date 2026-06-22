import api from './axiosInstance';

export const authService = {
  async register(name, email, password, phone) {
    const res = await api.post('/auth/register', { name, email, password, phone });
    return res.data.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  async updateProfile(name, phone) {
    const res = await api.put('/auth/profile', { name, phone });
    return res.data.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    return res.data.data;
  },
};
