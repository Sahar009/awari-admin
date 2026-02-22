import api from '../lib/api';

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'phone';
  category: string;
  description: string;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfigsResponse {
  configs: SiteConfig[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PublicSiteConfigs {
  [category: string]: {
    [key: string]: any;
  };
}

export interface CreateSiteConfigPayload {
  value: string;
  type?: 'string' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'phone';
  category?: string;
  description?: string;
  isPublic?: boolean;
  sortOrder?: number;
}

export interface UpdateSiteConfigPayload {
  value?: string;
  type?: 'string' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'phone';
  category?: string;
  description?: string;
  isPublic?: boolean;
  sortOrder?: number;
  isActive?: boolean;
}

export const siteConfigService = {
  /**
   * Get all site configurations
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isPublic?: boolean;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<SiteConfigsResponse> {
    const response = await api.get<{ success: boolean; data: SiteConfigsResponse }>('/admin/site-configs', { params });
    return response.data.data;
  },

  /**
   * Get site configuration by key
   */
  async getByKey(key: string): Promise<SiteConfig> {
    const response = await api.get<{ success: boolean; data: SiteConfig }>(`/admin/site-configs/${key}`);
    return response.data.data;
  },

  /**
   * Create or update site configuration
   */
  async upsert(key: string, data: CreateSiteConfigPayload): Promise<SiteConfig> {
    const response = await api.put<{ success: boolean; data: SiteConfig }>(`/admin/site-configs/${key}`, data);
    return response.data.data;
  },

  /**
   * Update site configuration
   */
  async update(key: string, data: UpdateSiteConfigPayload): Promise<SiteConfig> {
    const response = await api.patch<{ success: boolean; data: SiteConfig }>(`/admin/site-configs/${key}`, data);
    return response.data.data;
  },

  /**
   * Delete site configuration
   */
  async delete(key: string): Promise<void> {
    await api.delete(`/admin/site-configs/${key}`);
  },

  /**
   * Toggle site configuration active status
   */
  async toggleActive(key: string): Promise<SiteConfig> {
    const response = await api.patch<{ success: boolean; data: SiteConfig }>(`/admin/site-configs/${key}/toggle`);
    return response.data.data;
  },

  /**
   * Get configurations by category
   */
  async getByCategory(category: string, params?: {
    isPublic?: boolean;
    isActive?: boolean;
  }): Promise<SiteConfig[]> {
    const response = await api.get<{ success: boolean; data: SiteConfig[] }>(`/admin/site-configs/category/${category}`, { params });
    return response.data.data;
  },

  /**
   * Get public site configurations (for frontend display)
   */
  async getPublic(): Promise<PublicSiteConfigs> {
    const response = await api.get<{ success: boolean; data: PublicSiteConfigs }>('/admin/site-configs/public');
    return response.data.data;
  }
};

export default siteConfigService;
