import type { ReactNode } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/design-system'
import { useCompactViewport } from './useCompactViewport'
/** Same filter state, different task surface: anchored desktop controls and a reachable mobile sheet. */
export function PaymentFilterSurface({
  open,
  onOpenChange,
  trigger,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactNode
  children: ReactNode
}) {
  const compact = useCompactViewport()
  if (compact)
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="proto-mobile-filters">
          <SheetTitle className="sr-only">Filter payments</SheetTitle>
          <SheetDescription className="sr-only">
            Filter the payment queue by bank, date and status.
          </SheetDescription>
          <div className="proto-mobile-filter-body">{children}</div>
        </SheetContent>
      </Sheet>
    )
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="proto-filter-popover"
        aria-label="Filter payments"
      >
        {children}
      </PopoverContent>
    </Popover>
  )
}
