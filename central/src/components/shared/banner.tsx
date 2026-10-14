import { useId, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { Button } from '../ui/button'
export type BannerAction = {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}
export function Banner({
  title,
  description,
  primaryAction,
  secondaryAction,
  actions,
  visual,
  tone = 'neutral',
  onDismiss,
}: {
  title: string
  description: string
  primaryAction?: BannerAction
  secondaryAction?: BannerAction
  actions?: ReactNode
  visual?: ReactNode
  tone?: 'neutral' | 'brand' | 'inverse'
  onDismiss?: () => void
}) {
  const id = useId()
  return (
    <section
      className="ds-banner"
      data-tone={tone}
      data-visual={!!visual}
      aria-labelledby={id}
    >
      <div className="banner-content">
        <div className="banner-copy">
          <h2 id={id} className="type-h2">
            {title}
          </h2>
          <p className="type-body">{description}</p>
        </div>
        {(primaryAction || secondaryAction || actions) && (
          <div className="banner-actions">
            {actions}
            {secondaryAction && (
              <Button
                variant="ghost"
                disabled={secondaryAction.disabled}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                disabled={primaryAction.disabled}
                loading={primaryAction.loading}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
      {visual && (
        <div className="banner-visual" aria-hidden="true">
          {visual}
        </div>
      )}
      {onDismiss && (
        <Button
          className="banner-close"
          variant="ghost"
          size="icon"
          aria-label="Dismiss banner"
          onClick={onDismiss}
        >
          <X size={16} />
        </Button>
      )}
    </section>
  )
}
