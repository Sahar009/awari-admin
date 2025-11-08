import api, { setAuthToken } from '../lib/api';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
  message?: string;
}

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<{ success: boolean; message?: string; data: LoginResponse }>('/auth/login', {
      email,
      password
    });
    return response.data?.data ?? (response.data as unknown as LoginResponse);
  },

  async fetchProfile() {
    const response = await api.get<{ success: boolean; data: AdminUser }>('/auth/profile');
    return response.data?.data ?? (response.data as unknown as AdminUser);
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // even if request fails just proceed
    } finally {
      setAuthToken(null);
    }
  }
};

export default authService;


