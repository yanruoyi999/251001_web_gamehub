import clsx from 'clsx';
import { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('border-b border-gray-200 px-6 py-4', className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={clsx('text-sm text-gray-500', className)} {...props} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('px-6 py-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('border-t border-gray-200 px-6 py-4', className)} {...props} />;
}
