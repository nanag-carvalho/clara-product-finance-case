import type { PaymentReviewFields } from './payment-review'
import type { ReactNode } from 'react'
import { CheckCircle, Info, ShieldCheck, Clock } from '@phosphor-icons/react'
import { Badge, ReviewSummary, FlowIllustration } from '@/design-system'
import type { Stage } from './flow-model'
import { paymentStatusLabels } from './scenarios'

/** Present request context and outcomes without owning payment transitions. */
export function StatusBadge({ stage }: { stage: Stage }) {
  const tone =
    stage === 'paid'
      ? 'status-success'
      : stage === 'failed' || stage === 'rejected'
        ? 'status-error'
        : stage === 'approval' || stage === 'unknown'
          ? 'status-pending'
          : ['authorize', 'bank', 'processing'].includes(stage)
            ? 'status-processing'
            : ''
  const Icon =
    stage === 'paid'
      ? CheckCircle
      : stage === 'failed'
        ? Info
        : stage === 'authorize' || stage === 'bank'
          ? ShieldCheck
          : Clock
  return (
    <Badge variant="outline" className={tone}>
      <Icon size={13} />
      {paymentStatusLabels[stage]}
    </Badge>
  )
}
export function PaymentReview({
  title,
  fields,
  footer,
}: {
  title: string
  fields: PaymentReviewFields
  footer?: ReactNode
}) {
  return (
    <div className="proto-review-columns">
      <ReviewSummary variant="subtle" title={title} fields={fields.payment} />
      <ReviewSummary
        variant="subtle"
        title="Request context"
        fields={fields.context}
      />
      {footer && <div className="proto-review-footer">{footer}</div>}
    </div>
  )
}
export function StateFeedback({
  children,
  progress,
}: {
  children: ReactNode
  progress?: ReactNode
}) {
  return (
    <section className="proto-state-feedback">
      {children}
      {progress && (
        <div className="proto-state-feedback-footer">{progress}</div>
      )}
    </section>
  )
}
export function Completion({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="proto-completion" role="status" aria-live="polite">
      <FlowIllustration kind="paid" />
      <h3 className="type-h2">{title}</h3>
      <p className="type-ui">{description}</p>
    </section>
  )
}
