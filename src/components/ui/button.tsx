import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#078930]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default:
          'rounded-full bg-[#078930] text-white shadow-sm shadow-[#078930]/25 hover:bg-[#056b24]',
        secondary:
          'rounded-full bg-[#0b6e99] text-white shadow-sm shadow-[#0b6e99]/20 hover:bg-[#0a5a7e]',
        outline:
          'rounded-full border border-black/10 bg-white/90 text-[#056b24] shadow-sm backdrop-blur-sm hover:bg-[#078930]/08 dark:border-white/15 dark:bg-white/5 dark:text-[#7dcea0]',
        ghost: 'rounded-full hover:bg-black/5 dark:hover:bg-white/10',
        destructive: 'rounded-full bg-[#da121a] text-white hover:bg-[#b50f16]',
      },
      size: {
        default: 'h-11 min-h-[44px] px-5 py-2',
        sm: 'h-9 min-h-[36px] rounded-full px-3.5 text-xs',
        lg: 'h-12 min-h-[48px] rounded-full px-8 text-[15px]',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px] rounded-full',
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
