import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-2 text-base font-body text-lego-dark ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lego-yellow focus-visible:ring-offset-2 focus-visible:border-lego-yellow disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
