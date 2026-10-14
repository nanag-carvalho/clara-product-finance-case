import type { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
export function Chip({
  children,
  onRemove,
  onToggle,
  selected = false,
  disabled = false,
}: {
  children: ReactNode
  onRemove?: () => void
  onToggle?: () => void
  selected?: boolean
  disabled?: boolean
}) {
  if (onToggle)
    return (
      <button
        type="button"
        className="ds-chip"
        data-selected={selected}
        aria-pressed={selected}
        disabled={disabled}
        onClick={onToggle}
      >
        {children}
      </button>
    )
  return (
    <span className="ds-chip" data-selected={selected}>
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remover ${typeof children === 'string' ? children : 'filtro'}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
}
