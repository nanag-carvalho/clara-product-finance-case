import type { HTMLAttributes } from 'react'
import { cn } from 'cn'
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('ds-skeleton', className)}
    />
  )
}
