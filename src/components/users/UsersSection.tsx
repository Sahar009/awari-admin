import React, { useState } from 'react';
import { Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useAdminUsers,
  useAdminUserStatusMutation,
  useAdminUserRoleMutation,
  useAdminUserDetail,
  useAdminUserProfileMutation
} from '../../hooks/useAdminUsers';
import { ActionButton } from '../ui/ActionButton';
import UserDetailsDrawer from './UserDetailsDrawer';
import type { AdminUserProfileUpdatePayload } from '../../services/types';

const badgeColor: Record<string, string> = {
  admin: 'bg-amber-500/15 text-amber-500 dark:bg-amber-500/20',
  landlord: 'bg-indigo-500/15 text-indigo-500 dark:bg-indigo-500/20',
  agent: 'bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/20',
  hotel_provider: 'bg-sky-500/15 text-sky-500 dark:bg-sky-500/20',
  renter: 'bg-slate-500/15 text-slate-500 dark:bg-slate-500/20',
  buyer: 'bg-slate-500/15 text-slate-500 dark:bg-slate-500/20'
};

const statusColor: Record<string, string> = {
  active: 'text-emerald-500 bg-emerald-500/10',
  suspended: 'text-amber-500 bg-amber-500/10',
  banned: 'text-rose-500 bg-rose-500/10',
  pending: 'text-slate-500 bg-slate-500/10'
};

const roleOptions = [
  { value: 'renter', label: 'Renter' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'agent', label: 'Agent' },
  { value: 'hotel_provider', label: 'Hotel provider' },
  { value: 'admin', label: 'Admin' }
];

const extractErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
};

const UsersSection: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerFeedback, setDrawerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { data, isLoading, isFetching } = useAdminUsers({ page, limit });
  const statusMutation = useAdminUserStatusMutation();
  const roleMutation = useAdminUserRoleMutation();
  const profileMutation = useAdminUserProfileMutation();
  const { data: detailData, isLoading: isDetailLoading } = useAdminUserDetail(selectedUserId ?? undefined, drawerOpen);

  const handleStatusChange = (userId: string, action: 'activate' | 'suspend' | 'ban' | 'reinstate') => {
    statusMutation.mutate({ userId, action });
  };

  const handleRoleChange = (userId: string, role: string) => {
    roleMutation.mutate({ userId, role });
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setDrawerFeedback(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedUserId(null);
    setDrawerFeedback(null);
  };

  const handleDrawerRoleChange = (role: string) => {
    if (!selectedUserId) return;
    setDrawerFeedback(null);
    roleMutation.mutate(
      { userId: selectedUserId, role },
      {
        onSuccess: () => {
          setDrawerFeedback({ type: 'success', message: 'User role updated successfully.' });
        },
        onError: (error) => {
          setDrawerFeedback({ type: 'error', message: extractErrorMessage(error) });
        }
      }
    );
  };

  const handleDrawerStatusAction = (action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve') => {
    if (!selectedUserId) return;
    setDrawerFeedback(null);
    statusMutation.mutate(
      { userId: selectedUserId, action },
      {
        onSuccess: () => {
          const messageMap: Record<typeof action, string> = {
            activate: 'User activated successfully.',
            suspend: 'User suspended.',
            ban: 'User banned.',
            reinstate: 'User reinstated.',
            approve: 'User approved and activated.'
          };
          setDrawerFeedback({ type: 'success', message: messageMap[action] });
        },
        onError: (error) => {
          setDrawerFeedback({ type: 'error', message: extractErrorMessage(error) });
        }
      }
    );
  };

  const handleProfileSave = (payload: AdminUserProfileUpdatePayload) => {
    if (!selectedUserId) return;
    setDrawerFeedback(null);
    profileMutation.mutate(
      { userId: selectedUserId, payload },
      {
        onSuccess: (response) => {
          setDrawerFeedback({
            type: 'success',
            message: response.message || 'User profile updated successfully.'
          });
        },
        onError: (error) => {
          setDrawerFeedback({ type: 'error', message: extractErrorMessage(error) });
        }
      }
    );
  };

  const pagination = data?.pagination;
  const currentPage = pagination?.currentPage ?? page;
  const users = data?.users ?? [];
  const totalItems = pagination?.totalItems ?? 0;
  const computedStart = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const computedEnd = totalItems === 0 ? 0 : Math.min(computedStart + users.length - 1, totalItems);
  const hasPrev = pagination ? pagination.hasPrevPage : currentPage > 1;
  const hasNext = pagination ? pagination.hasNextPage : users.length === limit;

  const isEmpty = !isLoading && users.length === 0;
  const paginationSummary =
    totalItems === 0 ? 'No users to display' : `Showing ${computedStart}-${computedEnd} of ${totalItems} users`;

  const pendingStatusUserId = (statusMutation.variables as { userId: string } | undefined)?.userId;
  const pendingRoleUserId = (roleMutation.variables as { userId: string } | undefined)?.userId;
  const isDrawerRoleUpdating = roleMutation.isPending && pendingRoleUserId === selectedUserId;
  const isDrawerStatusUpdating = statusMutation.isPending && pendingStatusUserId === selectedUserId;

  return (
    <section
      id="users"
      className="mt-12 rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">User management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and moderate users across the AWARI ecosystem.
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
          <ActionButton variant="outline" label="Export CSV" />
          <ActionButton variant="secondary" label="Invite admin" />
        </div> */}
      </div>

      <div className="mt-6 overflow-x-auto">
        {isFetching && !isLoading && (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-xs text-indigo-500 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200">
            <Loader className="h-3.5 w-3.5 animate-spin" />
            Refreshing users...
          </div>
        )}
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead>
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
              <th className="px-4 py-3 text-left font-semibold">Last login</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-500" />
                </td>
              </tr>
            )}

            {isEmpty && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No users found for the current filters.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => {
                const roleBadge = badgeColor[user.role] ?? 'bg-slate-500/15 text-slate-500';
                const statusBadge = statusColor[user.status] ?? 'bg-slate-500/15 text-slate-500';
                const isUpdatingStatus = statusMutation.isPending && pendingStatusUserId === user.id;
                const isUpdatingRole = roleMutation.isPending && pendingRoleUserId === user.id;
                const disableStatusActions = user.role === 'admin';

                return (
                  <tr key={user.id} className="text-sm text-slate-600 dark:text-slate-300">
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      {user.role === 'admin' ? (
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleBadge}`}
                        >
                          {user.role.replace('_', ' ')}
                        </span>
                      ) : (
                        <div className="relative inline-flex items-center">
                          <select
                            value={user.role}
                            onChange={(event) => handleRoleChange(user.id, event.target.value)}
                            className="rounded-full border border-slate-200 bg-transparent px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-300"
                            disabled={isUpdatingRole}
                          >
                            {roleOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {isUpdatingRole && (
                            <Loader className="absolute -right-5 h-3.5 w-3.5 animate-spin text-indigo-500" />
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <ActionButton
                          variant="outline"
                          label="View"
                          onClick={() => handleViewUser(user.id)}
                        />
                        {user.status !== 'active' ? (
                          <ActionButton
                            variant="secondary"
                            label="Activate"
                            onClick={() => handleStatusChange(user.id, 'activate')}
                            disabled={isUpdatingStatus || isUpdatingRole || disableStatusActions}
                          />
                        ) : (
                          <ActionButton
                            variant="outline"
                            label="Suspend"
                            onClick={() => handleStatusChange(user.id, 'suspend')}
                            disabled={isUpdatingStatus || isUpdatingRole || disableStatusActions}
                          />
                        )}
                        <ActionButton
                          variant="outline"
                          label="Ban"
                          onClick={() => handleStatusChange(user.id, 'ban')}
                          disabled={isUpdatingStatus || isUpdatingRole || disableStatusActions}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{paginationSummary}</p>
        <div className="flex items-center gap-3">
          <ActionButton
            variant="outline"
            label="Previous"
            startIcon={<ChevronLeft className="h-4 w-4" />}
            onClick={() => hasPrev && setPage((prev) => Math.max(prev - 1, 1))}
            disabled={!hasPrev || isFetching || isLoading}
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {currentPage} of {pagination?.totalPages ?? Math.max(Math.ceil(totalItems / limit), 1)}
          </span>
          <ActionButton
            variant="outline"
            label="Next"
            endIcon={<ChevronRight className="h-4 w-4" />}
            onClick={() => hasNext && setPage((prev) => prev + 1)}
            disabled={!hasNext || isFetching || isLoading}
          />
        </div>
      </div>
      <UserDetailsDrawer
        isOpen={drawerOpen}
        detail={detailData}
        isLoading={isDetailLoading}
        isSaving={profileMutation.isPending}
        onClose={handleCloseDrawer}
        onSave={handleProfileSave}
        onRoleChange={handleDrawerRoleChange}
        onStatusAction={handleDrawerStatusAction}
        isRoleUpdating={isDrawerRoleUpdating}
        isStatusUpdating={isDrawerStatusUpdating}
        feedback={drawerFeedback}
      />
    </section>
  );
};

export default UsersSection;


