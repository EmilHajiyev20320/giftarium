import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/src/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magic-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-800 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-gradient-magic text-cosmic-800 shadow-glow-gold hover:shadow-glow hover:scale-105 active:scale-100',
        destructive: 'bg-error-500 text-white shadow-base hover:bg-error-600 hover:shadow-md',
        outline: 'border-2 border-magic-gold bg-cosmic-700 text-magic-gold shadow-glow-purple hover:bg-cosmic-600 hover:border-magic-amber hover:shadow-glow',
        secondary: 'bg-cosmic-600 text-magic-gold shadow-base hover:bg-cosmic-500 hover:shadow-glow-purple',
        ghost: 'bg-transparent text-neutral-200 hover:bg-cosmic-700/50 hover:text-magic-gold',
        link: 'text-magic-gold underline-offset-4 hover:text-magic-amber hover:underline',
      },
      size: {
        default: 'h-12 px-6 text-base',
        sm: 'h-10 px-4 text-sm rounded-lg',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

