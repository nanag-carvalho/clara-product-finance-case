import type { ComponentProps, ReactNode } from 'react'
import { Input } from './input'
import { cn } from 'cn'
export function InputGroup({
  leadingIcon,
  trailing,
  className,
  controlSize = 'md',
  actionLayout = 'inline',
  ...props
}: ComponentProps<typeof Input> & {
  leadingIcon?: ReactNode
  trailing?: ReactNode
  actionLayout?: 'inline' | 'responsive'
}) {
  const invalid =
    props['aria-invalid'] === true || props['aria-invalid'] === 'true'
  return (
    <div
      data-slot="input-group"
      data-size={controlSize}
      data-action-layout={actionLayout}
      data-invalid={invalid || undefined}
      className={cn('ds-input-group', className)}
    >
      {leadingIcon && (
        <span data-slot="input-group-addon" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <Input {...props} controlSize={controlSize} />
      {trailing && <span data-slot="input-group-action">{trailing}</span>}
    </div>
  )
}
