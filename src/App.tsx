
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Loader } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import { Navigate, Route, Routes } from 'react-router-dom';
import OverviewPage from './pages/Overview';
import UsersPage from './pages/Users';
import PropertiesPage from './pages/Properties';
import ModerationPage from './pages/Moderation';
import TransactionsPage from './pages/Transactions';
import WithdrawalsPage from './pages/Withdrawals';
import SubscriptionsPage from './pages/Subscriptions';
import PlansPage from './pages/Plans';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import BookingFeesSettings from './pages/BookingFeesSettings';
import BookingsPage from './pages/Bookings';
import BookingConfigPage from './pages/BookingConfig';
import SiteConfigPage from './pages/SiteConfig';
import { useAdminAuth } from './context/AdminAuthContext';
import LoginForm from './components/auth/LoginForm';

type Theme = 'light' | 'dark';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const { user, isLoading, logout } = useAdminAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = window.localStorage.getItem('awari-admin-theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('awari-admin-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const isDark = useMemo(() => theme === 'dark', [theme]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <Loader className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <div className="min-h-screen flex">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} user={user} onLogout={logout} />

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <Header
            onToggleSidebar={toggleSidebar}
            onToggleTheme={toggleTheme}
            isDark={isDark}
            user={user}
          />

          <main className="flex-1 bg-transparent">
            <div className="px-6 py-8">
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/moderation" element={<ModerationPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/withdrawals" element={<WithdrawalsPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/subscription-plans" element={<PlansPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/booking-fees" element={<BookingFeesSettings />} />
                <Route path="/booking-config" element={<BookingConfigPage />} />
                <Route path="/site-config" element={<SiteConfigPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;

