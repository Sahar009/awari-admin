import React, { useState, useEffect } from 'react';
import SiteConfigSection from '../components/site-configs/SiteConfigSection';
import { useSiteConfigs, useUpdateSiteConfig } from '../hooks/useSiteConfigs';
import { Loader } from 'lucide-react';

const SiteConfigPage: React.FC = () => {
  const { data } = useSiteConfigs({ search: 'allow_listings_without_subscription' });
  const updateMutation = useUpdateSiteConfig();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current toggle state from API
  useEffect(() => {
    if (data?.configs && data.configs.length > 0) {
      const config = data.configs[0];
      setIsEnabled(config.value === 'true');
    }
  }, [data]);

  const handleToggle = async () => {
    setIsLoading(true);
    const newValue = !isEnabled;
    
    try {
      await updateMutation.mutateAsync({
        key: 'allow_listings_without_subscription',
        data: { value: newValue ? 'true' : 'false' }
      });
      setIsEnabled(newValue);
    } catch (error) {
      console.error('Failed to update subscription toggle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Configuration</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage website settings, contact information, and global configurations.
              </p>
            </div>
          </div>

          {/* Subscription Toggle */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Free Listings
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {isEnabled ? 'No subscription required' : 'Subscription required'}
              </div>
            </div>
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                isEnabled
                  ? 'bg-indigo-600'
                  : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              {isLoading ? (
                <Loader className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
              ) : (
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                    isEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      </header>

      <SiteConfigSection />
    </div>
  );
};

export default SiteConfigPage;
