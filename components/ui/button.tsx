import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-200',
  ghost:
    'text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-200',
  outline:
    'border border-gray-300 text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-300 bg-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth,
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
