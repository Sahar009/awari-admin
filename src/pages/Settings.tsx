import { useMemo, useState } from 'react';
import { ShieldCheck, Bell, MonitorCog, Save, Key, RefreshCcw } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

interface ToggleButtonProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}

const ToggleButton = ({ label, description, value, onChange }: ToggleButtonProps) => {
  const toggleClasses = useMemo(
    () =>
      value
        ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30 dark:bg-indigo-600'
        : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
    [value]
  );

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex w-full flex-col items-start gap-1 rounded-2xl border border-transparent px-5 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${toggleClasses}`}
    >
      <span className="text-sm font-semibold">{label}</span>
      {description ? <span className="text-xs opacity-80">{description}</span> : null}
      <span className="mt-2 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] uppercase tracking-wide">
        {value ? 'Enabled' : 'Disabled'}
      </span>
    </button>
  );
};

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@awarihomes.com',
    phoneNumber: '+234 800 0000 000',
    jobTitle: 'Platform Administrator'
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    sessionTimeout: 30
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    systemAlerts: true,
    weeklyReports: true,
    moderationQueue: true,
    billingUpdates: false,
    activityDigest: true
  });

  const [preferences, setPreferences] = useState({
    autoTheme: false,
    compactMode: false,
    language: 'en-NG',
    timezone: 'Africa/Lagos',
    sessionRefresh: true
  });

  const [apiKeys] = useState([
    { id: 'paystack', label: 'Paystack Secret Key', value: 'sk_live_•••••••••••0x1n', lastRotated: '14 days ago' },
    { id: 'firebase', label: 'Firebase Admin Key', value: 'service-account-••••.json', lastRotated: '2 months ago' }
  ]);

  const handleProfileChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: keyof typeof security, value: string | number) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder for API integration
  };

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Workspace settings</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Update administrator profile, security policies, notifications, and workspace preferences.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Last policy review: 2 days ago</span>
          </div>
        </div>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage the details that appear across the admin workspace.</p>
            </div>
            <ActionButton label="Save" type="submit" startIcon={<Save className="h-4 w-4" />} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">First name</span>
              <input
                type="text"
                value={profile.firstName}
                onChange={(event) => handleProfileChange('firstName', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">Last name</span>
              <input
                type="text"
                value={profile.lastName}
                onChange={(event) => handleProfileChange('lastName', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">Email address</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => handleProfileChange('email', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">Phone number</span>
              <input
                type="tel"
                value={profile.phoneNumber}
                onChange={(event) => handleProfileChange('phoneNumber', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
          </div>
          <label className="mt-4 block text-sm md:w-1/2">
            <span className="text-slate-500 dark:text-slate-400">Job title</span>
            <input
              type="text"
              value={profile.jobTitle}
              onChange={(event) => handleProfileChange('jobTitle', event.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Security controls</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enforce strong authentication and manage access to the admin workspace.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Security score: 94%</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">Current password</span>
              <input
                type="password"
                value={security.currentPassword}
                onChange={(event) => handleSecurityChange('currentPassword', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">New password</span>
              <input
                type="password"
                value={security.newPassword}
                onChange={(event) => handleSecurityChange('newPassword', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="Must be 12+ characters"
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="text-slate-500 dark:text-slate-400">Confirm new password</span>
              <input
                type="password"
                value={security.confirmPassword}
                onChange={(event) => handleSecurityChange('confirmPassword', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ToggleButton
              label="Two-factor authentication"
              description="Require OTP verification when administrators sign in."
              value={security.twoFactorEnabled}
              onChange={(next) => setSecurity((prev) => ({ ...prev, twoFactorEnabled: next }))}
            />
            <ToggleButton
              label="Automatic session lock"
              description={`Lock dashboard after ${security.sessionTimeout} minutes of inactivity.`}
              value={preferences.sessionRefresh}
              onChange={(next) => setPreferences((prev) => ({ ...prev, sessionRefresh: next }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Session timeout</span>
            <div className="flex items-center gap-2">
              {[15, 30, 60].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSecurityChange('sessionTimeout', option)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    security.sessionTimeout === option
                      ? 'bg-indigo-500 text-white shadow-sm dark:bg-indigo-600'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {option} min
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Notification preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Choose how the platform keeps administrators informed.</p>
            </div>
            <Bell className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ToggleButton
              label="System alerts"
              description="Critical platform issues, downtime notices, and policy violations."
              value={notificationPrefs.systemAlerts}
              onChange={(next) => setNotificationPrefs((prev) => ({ ...prev, systemAlerts: next }))}
            />
            <ToggleButton
              label="Weekly performance report"
              description="KPI summary and revenue insights delivered every Monday."
              value={notificationPrefs.weeklyReports}
              onChange={(next) => setNotificationPrefs((prev) => ({ ...prev, weeklyReports: next }))}
            />
            <ToggleButton
              label="Moderation queue"
              description="Alerts when new reviews or properties need attention."
              value={notificationPrefs.moderationQueue}
              onChange={(next) => setNotificationPrefs((prev) => ({ ...prev, moderationQueue: next }))}
            />
            <ToggleButton
              label="Billing updates"
              description="Invoices, payouts, and subscription changes."
              value={notificationPrefs.billingUpdates}
              onChange={(next) => setNotificationPrefs((prev) => ({ ...prev, billingUpdates: next }))}
            />
            <ToggleButton
              label="Activity digest"
              description="Daily round-up of team activities and approvals."
              value={notificationPrefs.activityDigest}
              onChange={(next) => setNotificationPrefs((prev) => ({ ...prev, activityDigest: next }))}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">System preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Control workspace behaviour, integrations, and regional settings.</p>
            </div>
            <MonitorCog className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <ToggleButton
                label="Automatic theme sync"
                description="Follows system light/dark preference for all administrators."
                value={preferences.autoTheme}
                onChange={(next) => setPreferences((prev) => ({ ...prev, autoTheme: next }))}
              />
              <ToggleButton
                label="Compact table density"
                description="Reduces row height across tables for power users."
                value={preferences.compactMode}
                onChange={(next) => setPreferences((prev) => ({ ...prev, compactMode: next }))}
              />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-800/70 dark:bg-slate-900/60">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Locale settings</h3>
              <label className="block text-sm">
                <span className="text-slate-500 dark:text-slate-400">Language</span>
                <select
                  value={preferences.language}
                  onChange={(event) => setPreferences((prev) => ({ ...prev, language: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                >
                  <option value="en-NG">English (Nigeria)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="fr-FR">Français</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-500 dark:text-slate-400">Timezone</span>
                <select
                  value={preferences.timezone}
                  onChange={(event) => setPreferences((prev) => ({ ...prev, timezone: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                >
                  <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                  <option value="Europe/London">Europe/London (BST)</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-800/70 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Integration credentials</h3>
              <ActionButton
                variant="secondary"
                label="Rotate keys"
                startIcon={<RefreshCcw className="h-4 w-4" />}
                onClick={(event) => {
                  event.preventDefault();
                }}
              />
            </div>
            <div className="space-y-3">
              {apiKeys.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 text-sm dark:border-slate-800/60 dark:bg-slate-900/50"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{entry.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last rotated {entry.lastRotated}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
                    <Key className="h-4 w-4 text-indigo-500" />
                    <span>{entry.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <ActionButton label="Save changes" type="submit" startIcon={<Save className="h-4 w-4" />} className="px-6" />
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
















