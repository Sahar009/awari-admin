import { useEffect, useState } from 'react';
import { ActionButton } from '../ui/ActionButton';

type ModerationAction = 'reject' | 'deactivate' | 'archive';

interface PropertyModerationDialogProps {
  isOpen: boolean;
  action: ModerationAction;
  propertyName?: string;
  onClose: () => void;
  onSubmit: (input: { reason?: string; notes?: string }) => void;
  isSubmitting?: boolean;
}

const actionCopy: Record<ModerationAction, { title: string; subtitle: string; cta: string }> = {
  reject: {
    title: 'Reject property submission',
    subtitle: 'Share why this property cannot go live. The landlord will receive your notes.',
    cta: 'Reject property'
  },
  deactivate: {
    title: 'Deactivate property',
    subtitle: 'Temporarily hide this property from the marketplace while you investigate.',
    cta: 'Deactivate property'
  },
  archive: {
    title: 'Archive property',
    subtitle: 'Archive the listing. It will no longer appear anywhere until reactivated.',
    cta: 'Archive property'
  }
};

export const PropertyModerationDialog = ({
  isOpen,
  action,
  propertyName,
  onClose,
  onSubmit,
  isSubmitting
}: PropertyModerationDialogProps) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setNotes('');
      setTouched(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const copy = actionCopy[action];
  const reasonRequired = action === 'reject';
  const canSubmit = reasonRequired ? reason.trim().length > 2 : true;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!canSubmit || isSubmitting) return;

    onSubmit({
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200/60 bg-white/95 p-6 shadow-2xl dark:border-slate-700/60 dark:bg-slate-900/90">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Moderation</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{copy.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {copy.subtitle}
              {propertyName ? (
                <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">({propertyName})</span>
              ) : null}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Reason {reasonRequired ? <span className="text-rose-500">*</span> : null}
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Provide clear actionable context. This is visible to the property owner."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
              />
              {reasonRequired && touched && reason.trim().length < 3 ? (
                <p className="mt-1 text-xs text-rose-500">A short explanation (min. 3 characters) is required.</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Internal notes <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add moderation notes for the admin team."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/40"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <ActionButton variant="outline" label="Cancel" onClick={onClose} disabled={isSubmitting} />
              <ActionButton
                variant="primary"
                label={copy.cta}
                type="submit"
                disabled={!canSubmit || isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyModerationDialog;


















