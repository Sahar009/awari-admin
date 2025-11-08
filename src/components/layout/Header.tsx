import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import React from 'react';
import type { AdminUser } from '../../services/auth';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  user: AdminUser | null;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggleTheme, isDark, user }) => {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'AD'
    : 'AD';

  return (
  <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 backdrop-blur-lg transition-colors dark:border-slate-800/60 dark:bg-slate-900/80">
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden rounded-2xl border border-slate-200/70 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus-within:border-indigo-500 lg:flex lg:w-80">
          <Search className="mr-2 h-4 w-4" />
          <input
            type="search"
            placeholder="Search users, listings, transactions..."
            className="flex-1 bg-transparent outline-none dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold uppercase text-indigo-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-200">
          {initials}
        </div>
      </div>
    </div>
  </header>
  );
};

export default Header;


