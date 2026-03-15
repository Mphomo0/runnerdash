import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "badge-default",
        secondary: "badge-default",
        destructive: "badge-danger",
        outline: "border border-current bg-transparent",
        success: "badge-success",
        warning: "badge-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, style, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', ...style }}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
