import { activityFeed } from '../../data/dashboard';
import React from 'react';
import { useAdminOverview } from '../../hooks/useAdminDashboard';

export const ActivityFeed: React.FC = () => {
  const { data } = useAdminOverview();
  const recentUsers = data?.recentUsers ?? [];
  const recentProperties = data?.recentProperties ?? [];

  const combinedFeed = [
    ...recentProperties.map((property) => ({
      id: property.id,
      title: `New property awaiting review`,
      description: `${property.title} • ${property.listingType?.toUpperCase() ?? 'LISTING'}`,
      timestamp: new Date(property.createdAt).toLocaleString()
    })),
    ...recentUsers.map((user) => ({
      id: user.id,
      title: `New ${user.role} registered`,
      description: `${user.firstName} ${user.lastName} • ${user.email}`,
      timestamp: new Date(user.createdAt).toLocaleString()
    }))
  ].slice(0, 5);

  const fallback = activityFeed;

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent activity</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Latest events across the platform.</p>
      <ul className="mt-6 space-y-4">
        {(combinedFeed.length > 0 ? combinedFeed : fallback).map((activity) => (
          <li
            key={activity.id}
            className="rounded-xl border border-slate-200/70 p-4 dark:border-slate-800/70 dark:bg-slate-800/50"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.title}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{activity.description}</p>
            <span className="mt-2 block text-xs text-indigo-500 dark:text-indigo-300">{activity.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;


