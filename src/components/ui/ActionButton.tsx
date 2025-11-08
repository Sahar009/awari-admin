import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

export interface ActionButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:ring-indigo-400 border border-transparent',
  secondary:
    'bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 focus-visible:ring-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25 border border-transparent',
  outline:
    'bg-transparent border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500'
};

export const ActionButton = ({
  label,
  variant = 'primary',
  className = '',
  disabled,
  startIcon,
  endIcon,
  ...props
}: ActionButtonProps) => (
  <button
    type="button"
    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${className}`}
    disabled={disabled}
    {...props}
  >
    {startIcon ? <span className="inline-flex items-center">{startIcon}</span> : null}
    <span>{label}</span>
    {endIcon ? <span className="inline-flex items-center">{endIcon}</span> : null}
  </button>
);

export default ActionButton;


