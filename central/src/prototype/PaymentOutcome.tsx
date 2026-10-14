import { authorizationRoute } from './bank-capabilities'
import type { PaymentReviewFields } from './payment-review'
import { CheckCircle, Clock, Info } from '@phosphor-icons/react'
import {
  Alert,
  AlertTitle,
  AlertDescription,
  FlowState,
  ReviewSummary,
} from '@/design-system'
import { PaymentReview, StateFeedback, Completion } from './PaymentFeedback'
import { money, type State } from './flow-model'
import { displayDate } from './payment-queue'
type Props = {
  state: Readonly<State>
  fields: PaymentReviewFields
  reviewAsApprover: boolean
  approvalReceipt: boolean
}
/** Read-only lifecycle results. A company decision is never presented as settlement. */
export function PaymentOutcome({
  state,
  fields,
  reviewAsApprover,
  approvalReceipt,
}: Props) {
  const unavailable =
    authorizationRoute(state.bankSupport, state.bank) === 'unavailable'
  const bankHandoff =
    authorizationRoute(state.bankSupport, state.bank) === 'bank'
  const amount = money(state.amount)
  const paid = state.stage === 'paid'
  return (
    <>
      {state.stage === 'approval' && (
        <>
          {reviewAsApprover ? (
            <>
              <PaymentReview title="Requested by Nágela" fields={fields} />
              <p className="type-ui">
                Approval makes payment authorization available to the authorized
                representative.
              </p>
            </>
          ) : (
            <>
              <FlowState
                kind="waiting"
                title="Carlos is next"
                description="Your request is saved. Payment authorization will become available after company approval."
                owner="Carlos · Company approver"
              />
              <PaymentReview title="Request details" fields={fields} />
            </>
          )}
        </>
      )}
      {state.stage === 'rejected' && (
        <>
          <StateFeedback>
            <Alert className="status-error">
              <Info size={16} />
              <AlertTitle>Request rejected by Carlos</AlertTitle>
              <AlertDescription>{state.rejectionReason}</AlertDescription>
            </Alert>
          </StateFeedback>
          <PaymentReview title="Request details" fields={fields} />
          <p className="type-ui">
            Correct the details and send a new request for company review.
          </p>
        </>
      )}
      {state.stage === 'authorize' && (
        <>
          {unavailable && !approvalReceipt && (
            <Alert variant="destructive">
              <AlertTitle>Funding account unavailable</AlertTitle>
              <AlertDescription>
                This account cannot initiate the payment. Choose another funding
                account, then request a new company review. Your recipient and
                amount are saved.
              </AlertDescription>
            </Alert>
          )}
          {approvalReceipt ? (
            <>
              <Completion
                title="Request approved"
                description="Your decision is recorded. The authorized representative can now authorize the payment."
              />
            </>
          ) : (
            <FlowState
              compact
              kind="ready"
              title="Company approval complete"
              description={
                bankHandoff
                  ? 'Review the details, then authorize at your bank. You’ll return to the same payment.'
                  : 'Review the approved details before secure confirmation.'
              }
              owner="Authorized representative"
            />
          )}
          <PaymentReview
            title="Approved request"
            fields={{
              ...fields,
              context: [
                ...fields.context,
                { label: 'Company approval', value: 'Approved by Carlos' },
              ],
            }}
          />
        </>
      )}
      {state.stage === 'bank' && (
        <>
          <FlowState
            kind="security"
            title={
              bankHandoff
                ? 'Authorize at ' + state.bank
                : 'Confirm with your device'
            }
            description={
              bankHandoff
                ? 'Your bank must confirm this Pix before it is submitted. On return, Clara will track this same request. The supplier has not been paid yet.'
                : 'Use your device’s security method to authorize this Pix.'
            }
            owner="Authorized representative"
          />
          <ReviewSummary
            variant="subtle"
            title="Transaction details"
            fields={[
              { label: 'From', value: state.bank },
              { label: 'To', value: state.recipient },
              { label: 'Amount', value: amount, emphasis: true },
            ]}
          />
        </>
      )}
      {state.stage === 'processing' && (
        <>
          <p className="type-ui proto-loading-context">
            {amount} to {state.recipient}
            <br />
            From {state.bank}
          </p>
        </>
      )}
      {state.stage === 'funded' && (
        <>
          <Alert>
            <CheckCircle size={16} />
            <AlertTitle>Top-up confirmed</AlertTitle>
            <AlertDescription>
              {amount} reached the Clara account. The supplier has not been
              paid.
            </AlertDescription>
          </Alert>
          <ReviewSummary
            variant="subtle"
            fields={[
              { label: 'From', value: 'Clara account' },
              { label: 'Recipient', value: state.recipient },
              { label: 'Amount', value: amount, emphasis: true },
              { label: 'Company approval', value: 'Recorded' },
            ]}
          />
        </>
      )}
      {state.stage === 'failed' && (
        <>
          <StateFeedback>
            <Alert variant="destructive">
              <Info size={16} />
              <AlertTitle>
                {state.failureReason === 'limit'
                  ? 'Bank limit exceeded'
                  : state.failureReason === 'unavailable'
                    ? 'Payment could not be completed'
                    : 'Insufficient funds at your bank'}
              </AlertTitle>
              <AlertDescription>
                {state.failureReason === 'limit'
                  ? 'The bank declined this Pix because it exceeds the permitted payment limit.'
                  : state.failureReason === 'unavailable'
                    ? 'The payment service confirmed that this attempt was not completed.'
                    : 'The bank declined this Pix because the account has insufficient available funds.'}{' '}
                No transfer was completed.
              </AlertDescription>
            </Alert>
          </StateFeedback>
          <PaymentReview title="Saved payment details" fields={fields} />
          <p className="type-ui">
            {state.failureReason === 'limit'
              ? 'Check the limit at your bank or choose another connected account.'
              : state.failureReason === 'unavailable'
                ? 'Try again later or choose another connected bank.'
                : 'Make funds available at your bank or choose another connected account.'}{' '}
            Review the saved details and request fresh company approval before
            retrying.
          </p>
        </>
      )}
      {state.stage === 'unknown' && (
        <>
          <StateFeedback>
            <Alert>
              <Clock size={16} />
              <AlertTitle>We are checking the result</AlertTitle>
              <AlertDescription>
                The request was submitted, but the final response is
                unavailable. Keep the same request while checking its status.
              </AlertDescription>
            </Alert>
          </StateFeedback>
          <ReviewSummary
            variant="subtle"
            fields={[
              { label: 'Reference', value: state.intent },
              {
                label: 'Movement',
                value:
                  state.leg === 'funding' ? 'Bank → Clara' : 'Supplier payment',
              },
              { label: 'Amount', value: amount, emphasis: true },
            ]}
          />
          <p className="type-caption">
            A new payment is unavailable while this result is unresolved.
          </p>
        </>
      )}
      {paid && (
        <>
          <Completion
            title="Payment completed"
            description={amount + ' paid to ' + state.recipient}
          />
          <ReviewSummary
            variant="subtle"
            title="Transaction details"
            fields={[
              { label: 'Recipient', value: state.recipient },
              { label: 'Amount', value: amount, emphasis: true },
              { label: 'Method', value: 'Pix' },
              {
                label: 'Confirmed at',
                value: displayDate(
                  state.events.find(
                    (e) => e.title === 'Supplier payment confirmed',
                  )?.dateTime,
                ),
              },
              { label: 'Debited account', value: state.bank },
              { label: 'Reference', value: state.intent },
            ]}
          />
        </>
      )}
    </>
  )
}
