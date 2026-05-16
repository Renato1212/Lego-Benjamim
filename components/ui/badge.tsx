import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-body',
  {
    variants: {
      variant: {
        default: 'bg-lego-yellow text-lego-dark border-2 border-amber-400',
        secondary: 'bg-lego-blue text-white border-2 border-blue-700',
        destructive: 'bg-lego-red text-white border-2 border-red-800',
        outline: 'border-2 border-current text-lego-dark bg-white',
        green: 'bg-lego-green text-white border-2 border-green-700',
        purple: 'bg-purple-500 text-white border-2 border-purple-700',
        orange: 'bg-orange-500 text-white border-2 border-orange-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
