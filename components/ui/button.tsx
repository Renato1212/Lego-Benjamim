'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-nunito cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-lego-yellow text-lego-dark border-b-4 border-amber-500 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 active:border-b-0 shadow-md',
        destructive:
          'bg-lego-red text-white border-b-4 border-red-800 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-md',
        outline:
          'border-3 border-lego-yellow bg-white text-lego-dark hover:bg-lego-yellow/10 hover:-translate-y-0.5',
        secondary:
          'bg-lego-blue text-white border-b-4 border-blue-800 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-md',
        ghost: 'hover:bg-lego-yellow/20 text-lego-dark',
        green:
          'bg-lego-green text-white border-b-4 border-green-800 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0 shadow-md',
        link: 'text-lego-blue underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6 py-3 text-base',
        sm: 'h-9 rounded-xl px-4 text-sm',
        lg: 'h-14 rounded-3xl px-8 text-lg',
        xl: 'h-16 rounded-3xl px-10 text-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
