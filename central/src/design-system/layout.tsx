import { DotsThreeVertical } from '@phosphor-icons/react'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../components/ui/dropdown-menu'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import type { Spacing } from './registry'

type LayoutProps = HTMLAttributes<HTMLDivElement> & {
  gap?: Spacing
  children: ReactNode
}
export function Stack({
  gap = 8,
  className = '',
  style,
  children,
  ...props
}: LayoutProps) {
  return (
    <div
      {...props}
      className={`ds-stack ${className}`}
      style={
        { ...style, '--layout-gap': `var(--space-${gap})` } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
export function Inline({
  gap = 8,
  className = '',
  style,
  children,
  ...props
}: LayoutProps) {
  return (
    <div
      {...props}
      className={`ds-inline ${className}`}
      style={
        { ...style, '--layout-gap': `var(--space-${gap})` } as CSSProperties
      }
    >
      {children}
    </div>
  )
}
export function PageHeader({
  title,
  description,
  actions,
  primaryAction,
  secondaryAction,
  overflowActions,
  leading,
  titleLevel = 1,
  tone = 'plain',
  className = '',
}: {
  title: string
  description?: string
  actions?: ReactNode
  primaryAction?: HeaderAction
  secondaryAction?: HeaderAction
  overflowActions?: HeaderAction[]
  leading?: ReactNode
  titleLevel?: 1 | 2
  tone?: 'plain' | 'subtle' | 'brand'
  className?: string
}) {
  const Heading = titleLevel === 1 ? 'h1' : 'h2'
  return (
    <header data-tone={tone} className={`ds-page-header ${className}`}>
      <div className="ds-heading-main">
        {leading}
        <Stack gap={4}>
          <Heading className="type-h1">{title}</Heading>
          {description && <p className="type-body">{description}</p>}
        </Stack>
      </div>
      {actions ?? (
        <HeaderActions
          primary={primaryAction}
          secondary={secondaryAction}
          overflow={overflowActions}
        />
      )}
    </header>
  )
}

export type HeaderAction = {
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
}
export function HeaderActions({
  primary,
  secondary,
  overflow = [],
}: {
  primary?: HeaderAction
  secondary?: HeaderAction
  overflow?: HeaderAction[]
}) {
  return (
    <Inline gap={8} className="ds-header-actions">
      {secondary && (
        <Button
          variant="outline"
          disabled={secondary.disabled}
          loading={secondary.loading}
          loadingLabel={secondary.loadingLabel}
          onClick={secondary.onClick}
        >
          {secondary.label}
        </Button>
      )}
      {primary && (
        <Button
          disabled={primary.disabled}
          loading={primary.loading}
          loadingLabel={primary.loadingLabel}
          onClick={primary.onClick}
        >
          {primary.label}
        </Button>
      )}
      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More options">
              <DotsThreeVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {overflow.map((action) => (
              <DropdownMenuItem
                key={action.label}
                disabled={action.disabled}
                onSelect={action.onClick}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Inline>
  )
}
