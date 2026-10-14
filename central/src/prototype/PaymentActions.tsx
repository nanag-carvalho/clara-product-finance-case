import type { AuthorizationRoute } from './bank-capabilities'
import { ArrowClockwise, ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/design-system'
import type { Stage } from './flow-model'

type Props = {
  stage: Stage
  authorizationRoute: AuthorizationRoute
  transition: string | null
  connected: boolean
  deviceLinked: boolean
  reviewAsApprover: boolean
  approvalReceipt: boolean
  rejectionOpen: boolean
  checking: boolean
  bank: string
  onContinue: () => void
  onConnect: () => void
  onReceiveConnection: () => void
  onConfirmDevice: () => void
  onRequest: () => void
  onApprove: () => void
  onShowRejection: (open: boolean) => void
  onReject: () => void
  onAuthorize: () => void
  onConfirmPayment: () => void
  onPayFunded: () => void
  onRetry: () => void
  onCheck: () => void
  onEdit: () => void
  onClose: () => void
  onViewAll: () => void
}
/** Actions reflect lifecycle and actor context. The controller validates commands;
 * this presentation component never dispatches or owns a financial decision. */
export function PaymentActions(props: Props) {
  const busy = props.transition !== null
  switch (props.stage) {
    case 'entry':
      return (
        <Button disabled={busy} onClick={props.onContinue}>
          Continue <ArrowRight size={16} />
        </Button>
      )
    case 'connect':
      return (
        <Button
          disabled={busy || props.authorizationRoute === 'unavailable'}
          onClick={props.onConnect}
        >
          {props.connected ? 'Review payment' : 'Connect ' + props.bank}
        </Button>
      )
    case 'bank-connect':
      return (
        <Button
          loading={busy}
          loadingLabel={
            props.deviceLinked
              ? 'Securing device'
              : 'Receiving bank confirmation'
          }
          onClick={
            props.deviceLinked
              ? props.onConfirmDevice
              : props.onReceiveConnection
          }
        >
          {props.deviceLinked
            ? 'Confirm with device'
            : 'Continue after bank confirmation'}
        </Button>
      )
    case 'review':
      return (
        <Button
          loading={busy}
          loadingLabel="Sending request"
          onClick={props.onRequest}
        >
          Request approval
        </Button>
      )
    case 'approval':
      if (!props.reviewAsApprover)
        return (
          <Button variant="outline" onClick={props.onClose}>
            Back to payments
          </Button>
        )
      return props.rejectionOpen ? (
        <>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => props.onShowRejection(false)}
          >
            Keep reviewing
          </Button>
          <Button
            variant="destructive"
            loading={busy}
            loadingLabel="Recording rejection"
            onClick={props.onReject}
          >
            Confirm rejection
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => props.onShowRejection(true)}
          >
            Reject request
          </Button>
          <Button
            loading={busy}
            loadingLabel="Recording approval"
            onClick={props.onApprove}
          >
            Approve request
          </Button>
        </>
      )
    case 'authorize':
      if (!props.approvalReceipt && props.authorizationRoute === 'unavailable')
        return <Button onClick={props.onEdit}>Change funding account</Button>
      return props.approvalReceipt ? (
        <Button variant="outline" onClick={props.onClose}>
          Back to payments
        </Button>
      ) : (
        <Button
          disabled={busy || props.authorizationRoute === 'unavailable'}
          onClick={props.onAuthorize}
        >
          {props.authorizationRoute === 'bank'
            ? 'Continue to bank'
            : 'Authorize payment'}
        </Button>
      )
    case 'bank':
      return (
        <Button
          loading={busy}
          loadingLabel="Authorizing"
          onClick={props.onConfirmPayment}
        >
          {props.authorizationRoute === 'bank'
            ? 'Continue after bank authorization'
            : 'Confirm with device'}
        </Button>
      )
    case 'funded':
      return (
        <Button onClick={props.onPayFunded}>
          Pay supplier from Clara <ArrowRight size={16} />
        </Button>
      )
    case 'failed':
      return (
        <Button onClick={props.onRetry}>
          Review retry <ArrowClockwise size={16} />
        </Button>
      )
    case 'unknown':
      return (
        <Button
          variant="outline"
          loading={props.checking}
          loadingLabel="Checking this request"
          onClick={props.onCheck}
        >
          Check payment status
        </Button>
      )
    case 'rejected':
      return props.reviewAsApprover ? (
        <Button variant="outline" onClick={props.onClose}>
          Back to payments
        </Button>
      ) : (
        <Button onClick={props.onEdit}>Correct request</Button>
      )
    case 'paid':
      return (
        <Button variant="outline" onClick={props.onViewAll}>
          Back to all payments <ArrowRight size={16} />
        </Button>
      )
    default:
      return null
  }
}
