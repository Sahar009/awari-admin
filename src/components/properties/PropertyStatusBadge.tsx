interface PropertyStatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-600 dark:bg-amber-500/25 dark:text-amber-200',
  active: 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/25 dark:text-emerald-200',
  inactive: 'bg-slate-500/15 text-slate-600 dark:bg-slate-500/25 dark:text-slate-200',
  rejected: 'bg-rose-500/15 text-rose-600 dark:bg-rose-500/25 dark:text-rose-200',
  archived: 'bg-slate-700/20 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
  sold: 'bg-indigo-500/20 text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-200',
  rented: 'bg-sky-500/20 text-sky-600 dark:bg-sky-500/25 dark:text-sky-200',
  draft: 'bg-slate-400/10 text-slate-500 dark:bg-slate-700/30 dark:text-slate-300'
};

const formatStatusLabel = (status: string) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export const PropertyStatusBadge = ({ status }: PropertyStatusBadgeProps) => {
  const style = statusStyles[status] || statusStyles.draft;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {formatStatusLabel(status)}
    </span>
  );
};

export default PropertyStatusBadge;



