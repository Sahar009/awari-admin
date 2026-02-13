import api from '../lib/api';

export interface BookingConfigItem {
  id: string;
  key: string;
  value: string;
  description: string | null;
  isActive: boolean;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

const bookingConfigService = {
  async list() {
    const response = await api.get<{ success: boolean; data: BookingConfigItem[] }>(
      '/admin/booking-config'
    );
    return response.data.data;
  },

  async get(key: string) {
    const response = await api.get<{ success: boolean; data: BookingConfigItem }>(
      `/admin/booking-config/${key}`
    );
    return response.data.data;
  },

  async update(key: string, payload: { value: string; description?: string; isActive?: boolean }) {
    const response = await api.put<{ success: boolean; data: BookingConfigItem; message?: string }>(
      `/admin/booking-config/${key}`,
      payload
    );
    return response.data;
  },

  async remove(key: string) {
    const response = await api.delete<{ success: boolean; message?: string }>(
      `/admin/booking-config/${key}`
    );
    return response.data;
  }
};

export default bookingConfigService;
