import { useEffect, useRef, type ReactNode } from 'react'
import { ArrowLeft } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
export type WizardProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  steps: string[]
  current: number
  eyebrow?: ReactNode
  titleLeading?: ReactNode
  description?: string | null
  context?: ReactNode
  children: ReactNode
  actions?: ReactNode
  onBack?: () => void
  footerNote?: string
  closeLabel?: string
  showProgress?: boolean
  busyContent?: ReactNode
  size?: 'default' | 'wide'
  sideContent?: ReactNode
  footerContent?: ReactNode
}
/** Controlled task shell. The consumer owns validation, authorization and transitions. */
export function Wizard({
  open,
  onOpenChange,
  title,
  steps,
  current,
  eyebrow,
  titleLeading,
  description,
  context,
  children,
  actions,
  onBack,
  footerNote = 'Progress kept in this session',
  closeLabel = 'Save and close',
  showProgress = true,
  busyContent,
  size = 'default',
  sideContent,
  footerContent,
}: WizardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (open) {
      titleRef.current?.focus()
      scrollRef.current
        ?.querySelector('[data-slot=scroll-area-viewport]')
        ?.scrollTo({ top: 0 })
    }
  }, [open, current, title])
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...(description === null ? { 'aria-describedby': undefined } : {})}
        data-size={size}
        className={`ds-wizard ${busyContent ? 'ds-wizard-busy' : ''}`}
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          titleRef.current?.focus()
        }}
      >
        <div
          className="ds-wizard-content"
          aria-hidden={busyContent ? true : undefined}
          inert={busyContent ? true : undefined}
        >
          <div
            inert={footerContent ? true : undefined}
            className={`ds-wizard-workspace ${sideContent ? 'with-sidebar' : ''}`}
          >
            <div className="ds-wizard-main">
              <DialogHeader>
                {eyebrow && <div className="ds-wizard-eyebrow">{eyebrow}</div>}
                <div className="ds-wizard-title-row">
                  {titleLeading}
                  <DialogTitle ref={titleRef} tabIndex={-1} className="type-h1">
                    {title}
                  </DialogTitle>
                </div>
                {description !== null && (
                  <DialogDescription>
                    {description ??
                      (showProgress
                        ? `Step ${current + 1} of ${steps.length} · ${steps[current]}`
                        : 'Task status')}
                  </DialogDescription>
                )}
              </DialogHeader>
              {showProgress && (
                <ol className="ds-wizard-progress" aria-label="Task progress">
                  {steps.map((name, i) => (
                    <li
                      key={name}
                      aria-current={i === current ? 'step' : undefined}
                      className={i <= current ? 'complete' : ''}
                    >
                      <span className="sr-only">
                        {i < current
                          ? 'Previous phase: '
                          : i === current
                            ? 'Current phase: '
                            : 'Next phase: '}
                        {name}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              {context}
              <ScrollArea ref={scrollRef} className="ds-wizard-scroll">
                <div className="ds-wizard-body">
                  {children}
                  {sideContent && (
                    <details className="ds-wizard-mobile-tracking">
                      <summary>Payment progress and history</summary>
                      {sideContent}
                    </details>
                  )}
                </div>
              </ScrollArea>
            </div>
            {sideContent && (
              <aside
                className="ds-wizard-sidebar"
                aria-label="Payment progress and history"
              >
                <ScrollArea className="ds-wizard-sidebar-scroll">
                  {sideContent}
                </ScrollArea>
              </aside>
            )}
          </div>
          <div className="ds-wizard-footer-shell">
            <div
              className={
                footerContent ? 'ds-wizard-footer-expanded' : undefined
              }
            >
              {footerContent && (
                <ScrollArea className="ds-wizard-footer-scroll">
                  <div className="ds-wizard-footer-content">
                    {footerContent}
                  </div>
                </ScrollArea>
              )}
              <div className="ds-wizard-footer">
                {onBack ? (
                  <Button variant="ghost" onClick={onBack}>
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => onOpenChange(false)}>
                    {closeLabel}
                  </Button>
                )}
                <div className="ds-wizard-actions" aria-label="Step actions">
                  {actions ?? (
                    <span className="type-caption">{footerNote}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {busyContent && (
          <div className="ds-wizard-busy-surface">{busyContent}</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
