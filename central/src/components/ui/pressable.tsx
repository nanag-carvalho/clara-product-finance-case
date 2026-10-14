import type { ComponentProps } from 'react'
import { cn } from 'cn'
/** Interaction without a Button container or dimensions: images, rows and tiles. */
export function Pressable({
  className,
  type = 'button',
  ...props
}: ComponentProps<'button'>) {
  return (
    <button
      {...props}
      type={type}
      data-slot="pressable"
      className={cn('ds-pressable', className)}
    />
  )
}
