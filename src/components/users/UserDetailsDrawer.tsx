import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle2, IdCard, Loader, MapPin, ShieldCheck, TriangleAlert, X } from 'lucide-react';
import type {
  AdminUserDetailResponse,
  AdminUserProfileUpdatePayload,
  AdminUserOwnedProperty,
  AdminUserBooking,
  AdminUserSubscription,
  AdminUserKycDocument,
  AdminUserReview
} from '../../services/types';
import { ActionButton } from '../ui/ActionButton';

interface UserDetailsDrawerProps {
  isOpen: boolean;
  detail?: AdminUserDetailResponse;
  isLoading?: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: AdminUserProfileUpdatePayload) => void;
  onRoleChange?: (role: string) => void;
  onStatusAction?: (action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve') => void;
  isRoleUpdating?: boolean;
  isStatusUpdating?: boolean;
  feedback?: { type: 'success' | 'error'; message: string } | null;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  address: string;
  city: string;
  state: string;
  language: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  socialLinks: string;
  preferences: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycVerified: boolean;
  profileCompleted: boolean;
}

const initialFormState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatarUrl: '',
  address: '',
  city: '',
  state: '',
  language: '',
  dateOfBirth: '',
  gender: '',
  bio: '',
  socialLinks: '',
  preferences: '',
  emailVerified: false,
  phoneVerified: false,
  kycVerified: false,
  profileCompleted: false
};

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200',
  pending: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200',
  suspended: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
  banned: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200',
  deleted: 'bg-slate-500/15 text-slate-600 dark:bg-slate-700/40 dark:text-slate-300'
};

const roleOptions = [
  { value: 'renter', label: 'Renter' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'agent', label: 'Agent' },
  { value: 'hotel_provider', label: 'Hotel provider' },
  { value: 'admin', label: 'Administrator' }
];

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const formatDate = (value?: string | null, fallback = '—') => {
  if (!value) return fallback;
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return fallback;
  }
};

const formatDateTime = (value?: string | null, fallback = '—') => {
  if (!value) return fallback;
  try {
    return new Date(value).toLocaleString();
  } catch {
    return fallback;
  }
};

const formatCurrency = (value?: number, currency = 'NGN') => {
  if (value === undefined || value === null) return '—';
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number(value));
  } catch {
    return `${currency} ${value}`;
  }
};

const SummaryCard = ({
  title,
  value,
  subtitle,
  highlight
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  highlight?: boolean;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
    {highlight ? (
      <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 via-transparent to-transparent dark:from-indigo-500/20" />
    ) : null}
    <div className="relative">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="text-sm text-slate-600 dark:text-slate-300">{children}</div>
  </section>
);

const ListTable = <T,>({
  title,
  emptyMessage,
  headers,
  rows
}: {
  title: string;
  emptyMessage: string;
  headers: string[];
  rows: T[];
  renderRow: (item: T) => React.ReactNode;
}) => (
  <Section title={title}>
    {rows.length === 0 ? (
      <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
    ) : (
      <div className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800/60">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/60 dark:bg-slate-800/60">
            <tr className="text-xs uppercase text-slate-500 dark:text-slate-400">
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white/80 text-sm text-slate-600 dark:divide-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            {rows.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index}>{(ListTable as any).renderRow(item)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </Section>
);

export const UserDetailsDrawer = ({
  isOpen,
  detail,
  isLoading,
  isSaving,
  onClose,
  onSave,
  onRoleChange,
  onStatusAction,
  isRoleUpdating,
  isStatusUpdating,
  feedback
}: UserDetailsDrawerProps) => {
  const user = detail?.user;
  const summary = detail?.summary;

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      const nextState: FormState = {
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        avatarUrl: user.avatarUrl ?? '',
        address: user.address ?? '',
        city: user.city ?? '',
        state: user.state ?? '',
        language: user.language ?? '',
        dateOfBirth: user.dateOfBirth ?? '',
        gender: user.gender ?? '',
        bio: user.bio ?? '',
        socialLinks: user.socialLinks ? JSON.stringify(user.socialLinks, null, 2) : '',
        preferences: user.preferences ? JSON.stringify(user.preferences, null, 2) : '',
        emailVerified: Boolean(user.emailVerified),
        phoneVerified: Boolean(user.phoneVerified),
        kycVerified: Boolean(user.kycVerified),
        profileCompleted: Boolean(user.profileCompleted)
      };
      setFormState(nextState);
      setFormError(null);
    } else if (!isOpen) {
      setFormState(initialFormState);
      setFormError(null);
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!user) return;

    let parsedSocialLinks: AdminUserProfileUpdatePayload['socialLinks'] = null;
    let parsedPreferences: AdminUserProfileUpdatePayload['preferences'] = null;

    if (formState.socialLinks.trim()) {
      try {
        parsedSocialLinks = JSON.parse(formState.socialLinks);
      } catch (error) {
        setFormError('Social links must be valid JSON');
        return;
      }
    }

    if (formState.preferences.trim()) {
      try {
        parsedPreferences = JSON.parse(formState.preferences);
      } catch (error) {
        setFormError('Preferences must be valid JSON');
        return;
      }
    }

    const payload: AdminUserProfileUpdatePayload = {
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      email: formState.email.trim(),
      phone: formState.phone.trim() || null,
      avatarUrl: formState.avatarUrl.trim() || null,
      address: formState.address.trim() || null,
      city: formState.city.trim() || null,
      state: formState.state.trim() || null,
      language: formState.language.trim() || null,
      bio: formState.bio.trim() || null,
      socialLinks: parsedSocialLinks,
      preferences: parsedPreferences,
      dateOfBirth: formState.dateOfBirth || null,
      gender: formState.gender || null,
      emailVerified: formState.emailVerified,
      phoneVerified: formState.phoneVerified,
      kycVerified: formState.kycVerified,
      profileCompleted: formState.profileCompleted
    };

    onSave(payload);
  };

  const ownedProperties: AdminUserOwnedProperty[] = user?.ownedProperties ?? [];
  const userBookings: AdminUserBooking[] = user?.userBookings ?? [];
  const subscriptions: AdminUserSubscription[] = user?.subscriptions ?? [];
  const kycDocuments: AdminUserKycDocument[] = user?.kycDocuments ?? [];
  const reviews: AdminUserReview[] = user?.reviews ?? [];

  const statusActions = useMemo(() => {
    if (!user) return [];
    const actions: Array<{ label: string; action: 'activate' | 'suspend' | 'ban' | 'reinstate' | 'approve'; variant: 'primary' | 'secondary' | 'outline' }> = [];
    switch (user.status) {
      case 'pending':
        actions.push({ label: 'Approve', action: 'approve', variant: 'secondary' });
        actions.push({ label: 'Activate', action: 'activate', variant: 'secondary' });
        break;
      case 'active':
        actions.push({ label: 'Suspend', action: 'suspend', variant: 'outline' });
        actions.push({ label: 'Ban', action: 'ban', variant: 'outline' });
        break;
      case 'suspended':
      case 'banned':
      case 'deleted':
        actions.push({ label: 'Reinstate', action: 'reinstate', variant: 'secondary' });
        break;
      default:
        actions.push({ label: 'Activate', action: 'activate', variant: 'secondary' });
        actions.push({ label: 'Suspend', action: 'suspend', variant: 'outline' });
    }
    return actions;
  }, [user]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-y-auto border-l border-slate-200 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">User profile</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Loading user...'}
            </h2>
            {user ? (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className={`rounded-full px-3 py-1 font-semibold ${statusStyles[user.status] ?? statusStyles.pending}`}>
                  Status: {user.status}
                </span>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                  Role: {user.role.replace('_', ' ')}
                </span>
                <span>Joined {formatDate(user.createdAt)}</span>
                {user.lastLogin ? <span>Last login {formatDateTime(user.lastLogin)}</span> : null}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close user details"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6">
          {feedback ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200'
                  : 'border-rose-400/40 bg-rose-500/10 text-rose-600 dark:border-rose-400/30 dark:bg-rose-400/15 dark:text-rose-200'
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-28 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
              <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/60" />
            </div>
          ) : !user ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Unable to load user details. The account may have been removed.
            </div>
          ) : (
            <>
              {summary ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <SummaryCard title="Owned properties" value={summary.totalOwnedProperties} subtitle="Active & archived" />
                  <SummaryCard title="Total bookings" value={summary.totalBookings} subtitle={`${summary.activeBookings} active/completed`} />
                  <SummaryCard title="User reviews" value={summary.totalReviews} />
                  <SummaryCard
                    title="Active subscriptions"
                    value={summary.activeSubscriptions}
                    highlight
                    subtitle="Current billing cycles"
                  />
                </div>
              ) : null}

              <Section title="Account controls">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs uppercase tracking-wide text-slate-400">Role</label>
                    <select
                      value={user.role}
                      onChange={(event) => onRoleChange?.(event.target.value)}
                      disabled={isRoleUpdating}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {statusActions.map((item) => (
                      <ActionButton
                        key={item.label}
                        variant={item.variant}
                        label={item.label}
                        onClick={() => onStatusAction?.(item.action)}
                        disabled={isStatusUpdating}
                      />
                    ))}
                    {isStatusUpdating ? <Loader className="h-4 w-4 animate-spin text-indigo-500" /> : null}
                  </div>
                </div>
              </Section>

              <Section title="Profile information">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">First name</label>
                      <input
                        value={formState.firstName}
                        onChange={handleInputChange('firstName')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last name</label>
                      <input
                        value={formState.lastName}
                        onChange={handleInputChange('lastName')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange('email')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</label>
                      <input
                        value={formState.phone}
                        onChange={handleInputChange('phone')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date of birth</label>
                      <input
                        type="date"
                        value={formState.dateOfBirth}
                        onChange={handleInputChange('dateOfBirth')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gender</label>
                      <select
                        value={formState.gender}
                        onChange={handleInputChange('gender')}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      >
                        {genderOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</label>
                      <input
                        value={formState.address}
                        onChange={handleInputChange('address')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">City</label>
                      <input
                        value={formState.city}
                        onChange={handleInputChange('city')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">State</label>
                      <input
                        value={formState.state}
                        onChange={handleInputChange('state')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preferred language</label>
                      <input
                        value={formState.language}
                        onChange={handleInputChange('language')}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Avatar URL</label>
                    <input
                      value={formState.avatarUrl}
                      onChange={handleInputChange('avatarUrl')}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Bio</label>
                    <textarea
                      value={formState.bio}
                      onChange={handleInputChange('bio')}
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      placeholder="Short profile summary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Social links JSON</label>
                    <textarea
                      value={formState.socialLinks}
                      onChange={handleInputChange('socialLinks')}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      placeholder='e.g. { "twitter": "https://twitter.com/awari" }'
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Preferences JSON</label>
                    <textarea
                      value={formState.preferences}
                      onChange={handleInputChange('preferences')}
                      rows={3}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                      placeholder='e.g. { "currency": "NGN" }'
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={formState.emailVerified}
                        onChange={handleCheckboxChange('emailVerified')}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      Email verified
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={formState.phoneVerified}
                        onChange={handleCheckboxChange('phoneVerified')}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      Phone verified
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={formState.kycVerified}
                        onChange={handleCheckboxChange('kycVerified')}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      KYC verified
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={formState.profileCompleted}
                        onChange={handleCheckboxChange('profileCompleted')}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                      Profile completed
                    </label>
                  </div>

                  {formError ? (
                    <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200">
                      {formError}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-end gap-3">
                    <ActionButton variant="outline" label="Close" onClick={onClose} disabled={isSaving} />
                    <ActionButton
                      variant="primary"
                      label={isSaving ? 'Saving...' : 'Save changes'}
                      type="submit"
                      disabled={isSaving}
                    />
                  </div>
                </form>
              </Section>

              <Section title="Owned properties">
                {ownedProperties.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">This user has not published any properties yet.</p>
                ) : (
                  <div className="space-y-3">
                    {ownedProperties.map((property) => (
                      <div
                        key={property.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{property.title}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {[property.city, property.state].filter(Boolean).join(', ') || '—'}
                            </span>
                            <span>{property.listingType}</span>
                            <span>{formatDate(property.createdAt)}</span>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                          {property.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Recent bookings">
                {userBookings.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No bookings have been made by this user.</p>
                ) : (
                  <div className="space-y-3">
                    {userBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {booking.property?.title ?? 'Unknown property'}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                              <span>{booking.bookingType}</span>
                              <span>{formatDate(booking.createdAt)}</span>
                              <span>{formatCurrency(Number(booking.totalPrice ?? 0), booking.currency)}</span>
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                            {booking.status}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Stay: {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)} · Guests:{' '}
                          {booking.numberOfGuests ?? '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Active subscriptions">
                {subscriptions.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No subscriptions associated with this account.</p>
                ) : (
                  <div className="space-y-3">
                    {subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {subscription.planType.toUpperCase()}
                            </p>
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(subscription.startDate)} → {formatDate(subscription.endDate)}
                            </div>
                          </div>
                          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                            {subscription.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="KYC documents">
                {kycDocuments.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No verification documents submitted.</p>
                ) : (
                  <div className="space-y-3">
                    {kycDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <IdCard className="h-4 w-4 text-indigo-500" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{doc.documentType}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Submitted {formatDate(doc.createdAt)}{' '}
                              {doc.verifiedAt ? `· Verified ${formatDate(doc.verifiedAt)}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Recent reviews">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No reviews submitted by this user.</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-xl border border-slate-200/70 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {review.property?.title ?? 'Property review'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {review.reviewType} · Rated {review.rating}/5 · {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-700/40 dark:text-slate-300">
                            {review.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Security metadata">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-indigo-500" />
                    Login count: <span className="font-semibold text-slate-900 dark:text-white">{user.loginCount ?? 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    Last login: <span className="font-semibold text-slate-900 dark:text-white">{formatDateTime(user.lastLogin)}</span>
                  </div>
                  {user.googleId ? (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Connected Google account
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <TriangleAlert className="h-4 w-4 text-amber-500" />
                      No Google account linked
                    </div>
                  )}
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsDrawer;


