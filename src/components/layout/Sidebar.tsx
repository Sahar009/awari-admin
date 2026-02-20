import { ChevronRight, LogOut } from 'lucide-react';
import { adminNavigation, supportAdminNavigation, systemHealth } from '../../data/dashboard';
import React from 'react';
import { NavLink } from 'react-router-dom';
import type { AdminUser } from '../../services/auth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onLogout: () => Promise<void>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user, onLogout }) => {
  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'AD'
    : 'AD';

  // Choose navigation based on user role
  const currentNavigation = user?.role === 'support_admin' ? supportAdminNavigation : adminNavigation;

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200/60 bg-white/95 backdrop-blur-lg transition-transform duration-300 ease-out dark:border-slate-800/60 dark:bg-slate-900/90 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200/70 dark:border-slate-800/80">
            <div className="h-10 w-10 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                {user?.role === 'support_admin' ? 'AWARI Support Admin' : 'AWARI Admin'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.role === 'support_admin' ? 'Support Control Center' : 'Platform Control Center'}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {currentNavigation.map((item: { name: string; icon: any; path: string; badge?: string }) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-linear-to-r from-indigo-500/15 to-transparent text-indigo-500 dark:text-indigo-200'
                            : 'text-slate-600 hover:bg-linear-to-r hover:from-slate-100 hover:to-transparent hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-white'
                        }`
                      }
                      onClick={onClose}
                    >
                      <Icon className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-500 dark:bg-indigo-500/20">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-500" />
                    </NavLink>
                  </li>
                );
              })}
            </ul>
{
  user?.role === "admin" ? (
    <div className="mt-8 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800/70 dark:bg-slate-800/40">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">System Health</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Real-time platform services status overview.
              </p>
              <ul className="mt-4 space-y-3">
                {systemHealth.map((service) => (
                  <li key={service.name} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300">{service.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 ${
                        service.status === 'Operational'
                          ? 'bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/20'
                          : 'bg-amber-500/15 text-amber-500 dark:bg-amber-500/20'
                      }`}
                    >
                      {service.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

  ) : (
    <>
   
    </>
  )
}
            
          </nav>

          <div className="border-t border-slate-200/60 px-6 py-5 text-xs text-slate-500 dark:border-slate-800/70 dark:text-slate-400">
            <p>Logged in as</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {user ? `${user.firstName} ${user.lastName}` : 'Administrator'}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-200">
                {initials}
              </div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
            </div>
            <button
              className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200"
              onClick={() => {
                onLogout().catch(() => {});
              }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;


