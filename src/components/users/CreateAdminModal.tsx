import { useEffect, useState } from 'react';
import { ActionButton } from '../ui/ActionButton';

interface CreateAdminForm {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'support_admin';
}

interface CreateAdminModalProps {
  isOpen: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateAdminForm) => void;
}

const initialForm: CreateAdminForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'admin'
};

const CreateAdminModal = ({ isOpen, isSubmitting, errorMessage, onClose, onSubmit }: CreateAdminModalProps) => {
  const [form, setForm] = useState<CreateAdminForm>(initialForm);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field: keyof CreateAdminForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (value: string) => /.+@.+\..+/.test(value.trim());
  const isValid =
    form.firstName.trim().length >= 2 &&
    form.lastName.trim().length >= 2 &&
    validateEmail(form.email);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!isValid || isSubmitting) return;

    onSubmit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || undefined,
      role: form.role
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white/95 p-6 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/90">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              {form.role === 'admin' ? 'Create admin' : 'Create support admin'}
            </p>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Invite a new {form.role === 'admin' ? 'administrator' : 'support administrator'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              A temporary password will be generated automatically and emailed to the new {form.role === 'admin' ? 'admin' : 'support admin'} along with their access link.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">First name</span>
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="Jane"
                required
              />
              {touched && form.firstName.trim().length < 2 && (
                <span className="mt-1 block text-xs text-rose-500">Please enter at least 2 characters.</span>
              )}
            </label>

            <label className="block text-sm">
              <span className="text-slate-500 dark:text-slate-400">Last name</span>
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="Doe"
                required
              />
              {touched && form.lastName.trim().length < 2 && (
                <span className="mt-1 block text-xs text-rose-500">Please enter at least 2 characters.</span>
              )}
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="text-slate-500 dark:text-slate-400">Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="admin@example.com"
                required
              />
              {touched && !validateEmail(form.email) && (
                <span className="mt-1 block text-xs text-rose-500">Enter a valid email address.</span>
              )}
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="text-slate-500 dark:text-slate-400">Phone number (optional)</span>
              <input
                type="tel"
                value={form.phone ?? ''}
                onChange={(event) => updateField('phone', event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                placeholder="+234 800 000 0000"
              />
            </label>

            <label className="block text-sm md:col-span-2">
              <span className="text-slate-500 dark:text-slate-400">Admin Role</span>
              <select
                value={form.role}
                onChange={(event) => updateField('role', event.target.value as 'admin' | 'support_admin')}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
              >
                <option value="admin">Full Admin</option>
                <option value="support_admin">Support Admin</option>
              </select>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {form.role === 'admin' 
                  ? 'Full admin has access to all features including user management, subscriptions, and system configuration.'
                  : 'Support admin can view data and perform basic moderation tasks but cannot manage users or subscriptions.'
                }
              </p>
            </label>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 focus:outline-none dark:text-slate-400 dark:hover:text-slate-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <ActionButton 
              label={`Create ${form.role === 'admin' ? 'Full Admin' : 'Support Admin'}`} 
              type="submit" 
              disabled={!isValid || isSubmitting} 
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;
















