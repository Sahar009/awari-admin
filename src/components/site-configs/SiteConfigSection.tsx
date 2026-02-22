import React, { useState } from 'react';
import { Loader, Edit2, Trash2, Eye, EyeOff, ToggleLeft, ToggleRight, Search, Settings, Globe, Phone, Mail, MessageSquare, Shield, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  useSiteConfigs,
  useUpsertSiteConfig,
  useUpdateSiteConfig,
  useDeleteSiteConfig,
  useToggleSiteConfig
} from '../../hooks/useSiteConfigs';
import { ActionButton } from '../ui/ActionButton';
import type { SiteConfig } from '../../services/siteConfigService';

const typeIcons: Record<string, React.ComponentType<any>> = {
  string: Settings,
  number: Settings,
  boolean: ToggleLeft,
  json: Settings,
  url: Globe,
  email: Mail,
  phone: Phone
};

const categoryIcons: Record<string, React.ComponentType<any>> = {
  general: Settings,
  contact: Phone,
  social: MessageSquare,
  business: Globe,
  system: Shield,
  branding: Settings,
  seo: Globe,
  analytics: Settings
};

const typeColors: Record<string, string> = {
  string: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  number: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300',
  boolean: 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300',
  json: 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300',
  url: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
  email: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300',
  phone: 'bg-rose-100 text-rose-600 dark:bg-rose-800 dark:text-rose-300'
};

const categoryColors: Record<string, string> = {
  general: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  contact: 'bg-rose-100 text-rose-600 dark:bg-rose-800 dark:text-rose-300',
  social: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
  business: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-300',
  system: 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300',
  branding: 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-300',
  seo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-300',
  analytics: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-800 dark:text-cyan-300'
};

interface SiteConfigForm {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'url' | 'email' | 'phone';
  category: string;
  description: string;
  isPublic: boolean;
  sortOrder: number;
}

const SiteConfigSection: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState<boolean | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SiteConfig | null>(null);
  const [form, setForm] = useState<SiteConfigForm>({
    key: '',
    value: '',
    type: 'string',
    category: 'general',
    description: '',
    isPublic: true,
    sortOrder: 0
  });

  const { data, isLoading, isFetching } = useSiteConfigs({ page, limit, search: search.trim() || undefined, category, isPublic });
  const upsertMutation = useUpsertSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const deleteMutation = useDeleteSiteConfig();
  const toggleMutation = useToggleSiteConfig();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handlePublicChange = (value: string) => {
    if (value === 'all') {
      setIsPublic(undefined);
    } else {
      setIsPublic(value === 'public');
    }
    setPage(1);
  };

  const handleCreate = () => {
    setEditingConfig(null);
    setForm({
      key: '',
      value: '',
      type: 'string',
      category: 'general',
      description: '',
      isPublic: true,
      sortOrder: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (config: SiteConfig) => {
    setEditingConfig(config);
    setForm({
      key: config.key,
      value: config.value,
      type: config.type,
      category: config.category,
      description: config.description,
      isPublic: config.isPublic,
      sortOrder: config.sortOrder
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingConfig) {
        await updateMutation.mutateAsync({ key: form.key, data: form });
      } else {
        await upsertMutation.mutateAsync({ key: form.key, data: form });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const handleDelete = async (config: SiteConfig) => {
    if (confirm(`Are you sure you want to delete "${config.key}"?`)) {
      try {
        await deleteMutation.mutateAsync(config.key);
      } catch (error) {
        console.error('Failed to delete config:', error);
      }
    }
  };

  const handleToggleActive = async (config: SiteConfig) => {
    try {
      await toggleMutation.mutateAsync(config.key);
    } catch (error) {
      console.error('Failed to toggle config:', error);
    }
  };

  const configs = data?.configs || [];
  const pagination = data?.pagination;

  return (
    <section
      id="site-configs"
      className="mt-12 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Site Configuration</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage website settings and contact information.
          </p>
        </div>
        <ActionButton
          variant="secondary"
          label="Add Config"
          onClick={handleCreate}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search configurations..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              ×
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
        >
          <option value="">All Categories</option>
          <option value="general">General</option>
          <option value="contact">Contact</option>
          <option value="social">Social</option>
          <option value="business">Business</option>
          <option value="system">System</option>
          <option value="branding">Branding</option>
          <option value="seo">SEO</option>
          <option value="analytics">Analytics</option>
        </select>

        <select
          value={isPublic === undefined ? 'all' : isPublic ? 'public' : 'private'}
          onChange={(e) => handlePublicChange(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
        >
          <option value="all">All Visibility</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      {/* Loading State */}
      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-6 w-6 animate-spin text-indigo-500" />
          <span className="ml-2 text-sm text-slate-500">Loading configurations...</span>
        </div>
      )}

      {/* Configs List */}
      {!isLoading && !isFetching && (
        <div className="space-y-3">
          {configs.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No configurations found
              </p>
            </div>
          ) : (
            configs.map((config: SiteConfig) => {
              const TypeIcon = typeIcons[config.type] || Settings;
              const CategoryIcon = categoryIcons[config.category] || Settings;
              
              return (
                <div
                  key={config.id}
                  className="rounded-xl border border-slate-200/70 bg-white/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {config.key}
                        </h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${typeColors[config.type]}`}>
                          <TypeIcon className="h-3 w-3" />
                          {config.type}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${categoryColors[config.category]}`}>
                          <CategoryIcon className="h-3 w-3" />
                          {config.category}
                        </span>
                        {config.isPublic ? (
                          <Eye className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      
                      {config.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {config.description}
                        </p>
                      )}
                      
                      <div className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Value: </span>
                        <span className="text-slate-600 dark:text-slate-400 break-all">
                          {config.type === 'json' ? (
                            <code className="bg-slate-100 px-1 py-0.5 rounded text-xs dark:bg-slate-800">
                              {config.value}
                            </code>
                          ) : (
                            config.value
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(config)}
                        className={`p-2 rounded-lg transition-colors ${
                          config.isActive
                            ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        title={config.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {config.isActive ? (
                          <ToggleRight className="h-4 w-4" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(config)}
                        className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(config)}
                        className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 dark:bg-rose-800 dark:text-rose-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} configurations
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingConfig ? 'Edit Configuration' : 'Add Configuration'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Key
                  </label>
                  <input
                    type="text"
                    value={form.key}
                    onChange={(e) => setForm({ ...form, key: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                    placeholder="e.g., site_name"
                    required
                    disabled={!!editingConfig}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="json">JSON</option>
                    <option value="url">URL</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Value
                </label>
                <textarea
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  placeholder="Configuration value"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  >
                    <option value="general">General</option>
                    <option value="contact">Contact</option>
                    <option value="social">Social</option>
                    <option value="business">Business</option>
                    <option value="system">System</option>
                    <option value="branding">Branding</option>
                    <option value="seo">SEO</option>
                    <option value="analytics">Analytics</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                  placeholder="Brief description of this configuration"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={form.isPublic}
                  onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                  Make this configuration public (visible on frontend)
                </label>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={upsertMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {upsertMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default SiteConfigSection;
