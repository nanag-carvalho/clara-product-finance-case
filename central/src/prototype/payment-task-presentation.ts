import type { WizardProps } from '@/design-system'
import type { Stage } from './flow-model.ts'
import { paymentStatusLabels } from './scenarios.ts'
type Context = {
  stage: Stage
  bank: string
  reviewAsApprover: boolean
  deviceLinked: boolean
  qrOpen: boolean
  editNotice: string
  transition: string | null
}
const transitionLabels: Record<string, string> = {
  request: 'Saving your request',
  approval: 'Recording your approval',
  rejection: 'Recording your decision',
  device: 'Securing this device',
  authorization: 'Authorizing your payment',
}
type Presentation = Pick<
  WizardProps,
  | 'title'
  | 'steps'
  | 'current'
  | 'showProgress'
  | 'description'
  | 'size'
  | 'footerNote'
  | 'closeLabel'
> & { approvalReceipt: boolean; busyLabel?: string }
/** Derive the task shell from lifecycle/actor context; presentation never advances a payment. */
export function getPaymentTaskPresentation({
  stage,
  bank,
  reviewAsApprover,
  deviceLinked,
  qrOpen,
  editNotice,
  transition,
}: Context): Presentation {
  const preparing = ['entry', 'connect', 'bank-connect', 'review'].includes(
    stage,
  )
  const authorizing = ['authorize', 'bank'].includes(stage)
  const approvalReceipt = reviewAsApprover && stage === 'authorize'
  const titles: Partial<Record<Stage, string>> = {
    approval: reviewAsApprover ? 'Review approval' : 'Request sent',
    bank: 'Confirm payment',
    authorize: 'Review approved payment',
    'bank-connect': deviceLinked
      ? 'Secure this device'
      : 'Confirm the connection at your bank',
    entry: editNotice ? 'Correct payment details' : 'Who are you paying?',
    connect: 'Which account will fund this Pix?',
    review: 'Review the payment',
  }
  return {
    title:
      qrOpen && stage === 'entry'
        ? 'Scan a Pix QR code'
        : approvalReceipt
          ? 'Approval recorded'
          : (titles[stage] ?? paymentStatusLabels[stage]),
    steps: preparing
      ? ['Payment details', 'Source account', 'Review']
      : authorizing
        ? ['Approved payment', 'Secure confirmation']
        : ['Status'],
    current: preparing
      ? stage === 'entry'
        ? 0
        : stage === 'review'
          ? 2
          : 1
      : authorizing
        ? stage === 'authorize'
          ? 0
          : 1
        : 0,
    showProgress: !qrOpen && !approvalReceipt && (preparing || authorizing),
    description: approvalReceipt
      ? null
      : qrOpen
        ? 'Read the code, then confirm the recipient and amount.'
        : preparing || authorizing
          ? stage === 'bank-connect' && !deviceLinked
            ? 'Authorized representative · ' + bank
            : undefined
          : null,
    size: [
      'review',
      'approval',
      'authorize',
      'bank',
      'processing',
      'unknown',
      'paid',
      'rejected',
      'failed',
    ].includes(stage)
      ? 'wide'
      : 'default',
    footerNote:
      stage === 'paid'
        ? 'Payment confirmed'
        : ['processing', 'unknown'].includes(stage)
          ? 'Tracking this request'
          : 'Progress kept in this session',
    closeLabel:
      stage === 'paid'
        ? 'Back to payments'
        : stage === 'approval'
          ? 'Close request'
          : approvalReceipt
            ? 'Close confirmation'
            : 'Save and close',
    approvalReceipt,
    busyLabel:
      stage === 'processing'
        ? 'Authorization received · confirming the payment'
        : transition
          ? transitionLabels[transition]
          : undefined,
  }
}
