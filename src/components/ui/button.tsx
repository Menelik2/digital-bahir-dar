import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078930] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#078930] text-white hover:bg-[#056b24]',
        secondary: 'bg-[#0b6e99] text-white hover:bg-[#0a5a7e]',
        outline:
          'border border-[#078930]/30 bg-white text-[#056b24] hover:bg-[#078930]/8 dark:border-[#078930]/40 dark:bg-slate-900 dark:text-[#7dcea0]',
        ghost: 'hover:bg-[#078930]/10 dark:hover:bg-[#078930]/20',
        destructive: 'bg-[#da121a] text-white hover:bg-[#b50f16]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  )
)
Button.displayName = 'Button'
