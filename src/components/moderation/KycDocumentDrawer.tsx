import { useEffect, useState } from 'react';
import { Download, Eye, Mail, Shield, User2, X } from 'lucide-react';
import type { ModerationKycItem, ModerationKycUpdatePayload } from '../../services/types';
import { ActionButton } from '../ui/ActionButton';

interface KycDocumentDrawerProps {
  isOpen: boolean;
  document?: ModerationKycItem;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (payload: ModerationKycUpdatePayload) => void;
  feedback?: { type: 'success' | 'error'; message: string } | null;
}

const statusOptions = [
  { value: 'pending', label: 'Pending review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'expired', label: 'Expired' }
] as const;

type StatusOption = (typeof statusOptions)[number]['value'];

const normalizeStatus = (value?: string | null): StatusOption | undefined => {
  if (!value) return undefined;
  return statusOptions.some((option) => option.value === value)
    ? (value as StatusOption)
    : undefined;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
};

const KycDocumentDrawer = ({ isOpen, document, isSaving, onClose, onSave, feedback }: KycDocumentDrawerProps) => {
  const [formState, setFormState] = useState<ModerationKycUpdatePayload>({
    status: normalizeStatus(document?.status),
    verificationNotes: document?.verificationNotes ?? undefined,
    rejectionReason: document?.rejectionReason ?? undefined
  });
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (document && isOpen) {
      setFormState({
        status: normalizeStatus(document.status),
        verificationNotes: document.verificationNotes ?? undefined,
        rejectionReason: document.rejectionReason ?? undefined
      });
      setErrors(null);
    } else if (!isOpen) {
      setFormState({});
      setErrors(null);
    }
  }, [document, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: keyof ModerationKycUpdatePayload) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFormState((prev) => ({
      ...prev,
      [field]: field === 'status' ? normalizeStatus(value) : value === '' ? undefined : value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(null);
    if (!document) return;

    if (formState.status === 'rejected' && !(formState.rejectionReason || '').trim()) {
      setErrors('Please provide a rejection reason when rejecting a document.');
      return;
    }

    onSave({
      status: formState.status,
      verificationNotes: formState.verificationNotes ?? null,
      rejectionReason: formState.rejectionReason ?? null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="hidden flex-1 bg-slate-900/40 backdrop-blur-sm md:block" onClick={onClose} />
      <div className="ml-auto flex h-full w-full max-w-3xl flex-col overflow-y-auto border-l border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/80">
        hhhh  <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">KYC review</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {document?.user ? `${document.user.firstName} ${document.user.lastName}` : 'KYC document'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                {document?.documentType.replace('_', ' ')}
              </span>
              <span>Submitted {formatDateTime(document?.createdAt)}</span>
              {document?.expiresAt ? <span>Expires {formatDate(document.expiresAt)}</span> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close KYC drawer"
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

          <section className="grid gap-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70 md:grid-cols-[1.5fr,1fr]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm font-medium text-slate-900 dark:text-white">
                <span>Document preview</span>
                <div className="flex items-center gap-2 text-xs">
                  <ActionButton
                    variant="outline"
                    label="Open original"
                    startIcon={<Eye className="h-4 w-4" />}
                    onClick={() => document?.documentUrl && window.open(document.documentUrl, '_blank', 'noopener')}
                  />
                  <ActionButton
                    variant="outline"
                    label="Download"
                    startIcon={<Download className="h-4 w-4" />}
                    onClick={() => document?.documentUrl && window.open(document.documentUrl + '?download=1', '_blank', 'noopener')}
                  />
                </div>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-slate-800/70 dark:bg-slate-900/70">
                {document?.documentUrl ? (
                  <img
                    src={document.documentUrl}
                    alt={`${document?.documentType} document`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                    Document preview unavailable
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-indigo-500" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {document?.user ? `${document.user.firstName} ${document.user.lastName}` : 'Unknown user'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{document?.user?.email ?? '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Role: {document?.user?.role ?? '—'}</span>
              </div>
              {document?.documentNumber ? (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Document number: {document.documentNumber}</span>
                </div>
              ) : null}
              {document?.verificationNotes ? (
                <div className="rounded-xl bg-indigo-500/10 p-3 text-xs text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                  Last notes: {document.verificationNotes}
                </div>
              ) : null}
              {document?.verifier ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Previously reviewed by {document.verifier.firstName} {document.verifier.lastName} on{' '}
                  {formatDateTime(document.verifiedAt)}
                </div>
              ) : null}
            </div>
          </section>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</label>
                <select
                  value={formState.status ?? document?.status ?? 'pending'}
                  onChange={handleChange('status')}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rejection reason</label>
                <textarea
                  value={formState.rejectionReason ?? ''}
                  onChange={handleChange('rejectionReason')}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                  placeholder="Provide a reason if the document is rejected"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Verification notes</label>
              <textarea
                value={formState.verificationNotes ?? ''}
                onChange={handleChange('verificationNotes')}
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
                placeholder="Internal notes for other moderators"
              />
            </div>

            {errors ? (
              <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200">
                {errors}
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
        </div>
      </div>
    </div>
  );
};

export default KycDocumentDrawer;


