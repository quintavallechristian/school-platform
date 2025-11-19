import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ring ring-2 ring-gray-900/5 shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:opacity-90 focus:ring-primary',
        destructive:
          'bg-destructive text-destructive-foreground hover:opacity-90 focus:ring-destructive',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-slate-700/10 hover:text-white',
        secondary: 'bg-secondary text-secondary-foreground hover:opacity-90 focus:ring-secondary',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 shadow-none ring-0',
        link: 'text-primary underline-offset-4 hover:underline shadow-none ring-0 px-0',
      },
      size: {
        default: 'px-6 py-3 text-base',
        sm: 'px-4 py-2 text-sm',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
