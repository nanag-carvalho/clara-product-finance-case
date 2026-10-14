import type { ReactNode } from 'react'
export type ReviewField = {
  label: string
  value: ReactNode
  emphasis?: boolean
  stackOnMobile?: boolean
}
export function ReviewSummary({
  fields,
  title = 'Review payment',
  actions,
  variant = 'plain',
}: {
  fields: ReviewField[]
  title?: string
  actions?: ReactNode
  variant?: 'plain' | 'subtle'
}) {
  return (
    <section
      className={`ds-review ${variant === 'subtle' ? 'ds-review-subtle' : ''}`}
    >
      <h3 className="type-h3">{title}</h3>
      <dl>
        {fields.map((f) => (
          <div
            key={f.label}
            data-emphasis={f.emphasis || undefined}
            data-mobile-stack={f.stackOnMobile || undefined}
          >
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      {actions && (
        <div className="ds-inline" style={{ gap: 'var(--space-8)' }}>
          {actions}
        </div>
      )}
    </section>
  )
}
