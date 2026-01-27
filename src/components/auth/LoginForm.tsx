import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Loader, ArrowRight } from 'lucide-react';
import logo from '../../assets/logo.png';
import api from '../../lib/api';

const inputClasses =
  'w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500';

interface SnapshotData {
  pendingListings: number;
  activeHosts: number;
  urgentNotifications: number;
}

export const LoginForm = () => {
  const { login, isLoading, error } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SnapshotData>({
    pendingListings: 0,
    activeHosts: 0,
    urgentNotifications: 0
  });
  const [snapshotLoading, setSnapshotLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        setSnapshotLoading(true);
        const response = await api.get<{ success: boolean; data: SnapshotData }>('/admin/dashboard/snapshot');
        if (response.data.success && response.data.data) {
          setSnapshot(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch snapshot:', error);
        // Silently fail - use default values
      } finally {
        setSnapshotLoading(false);
      }
    };

    fetchSnapshot();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setLocalError(err?.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-slate-100 via-white to-slate-100 px-6 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_55%)]" />

      <div className="relative flex w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-slate-200/70 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/60">
        <div className="hidden w-2/5 flex-none flex-col justify-between border-r border-slate-200/70 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 text-white dark:border-slate-800/70 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 md:flex lg:p-12">
          <div>
            <img src={logo} alt="Awari logo" className="h-10 w-auto" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight">Welcome back, Admin</h2>
            <p className="mt-3 text-sm text-indigo-100/90">
              Monitor platform activity, manage listings, resolve disputes and keep the community running smoothly.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 text-sm text-indigo-50 shadow-lg backdrop-blur-md">
            <p className="font-semibold uppercase tracking-wider">Today&apos;s snapshot</p>
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span>New listings pending review</span>
                {snapshotLoading ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="font-semibold">{snapshot.pendingListings}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Active hosts online</span>
                {snapshotLoading ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="font-semibold">{snapshot.activeHosts}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Support tickets</span>
                {snapshotLoading ? (
                  <Loader className="h-3 w-3 animate-spin" />
                ) : (
                  <span className={`font-semibold ${snapshot.urgentNotifications > 0 ? 'text-amber-200' : ''}`}>
                    {snapshot.urgentNotifications > 0 ? `${snapshot.urgentNotifications} urgent` : '0'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-indigo-100/80">© {new Date().getFullYear()} Awari. All rights reserved.</p>
        </div>

        <div className="w-full flex-1 p-10 sm:p-12 md:w-3/5 lg:p-14">
          <div className="mb-10">
            <img src={logo} alt="Awari logo" className="mb-6 h-8 w-auto md:hidden" />
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Admin Portal</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Sign in with your administrator credentials to manage the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClasses}
              placeholder="admin@awarihomes.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClasses}
              placeholder="Enter password"
              required
            />
          </div>

          {(localError || error) && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 dark:bg-rose-500/20">
              {localError || error}
            </p>
          )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-indigo-500/90 dark:focus-visible:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              )}
              Admin Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            This portal is restricted to AWARI administrators. Access is monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;


