import type { ReactNode } from 'react'
import { Tray } from '@phosphor-icons/react'
import { Card, CardContent } from '../ui/card'
export function EmptyState({
  title,
  description,
  action,
  variant = 'card',
  icon,
}: {
  title: string
  description: string
  action?: ReactNode
  variant?: 'plain' | 'card'
  icon?: ReactNode
}) {
  const content = (
    <div className="ds-empty">
      <span className="empty-state-icon" aria-hidden="true">
        {icon ?? <Tray size={24} />}
      </span>
      <h3 className="type-h3">{title}</h3>
      <p className="type-ui">{description}</p>
      {action}
    </div>
  )
  return variant === 'card' ? (
    <Card className="empty-state-card">
      <CardContent>{content}</CardContent>
    </Card>
  ) : (
    content
  )
}
