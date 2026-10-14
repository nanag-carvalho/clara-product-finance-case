import { CheckCircle } from '@phosphor-icons/react'
import { ReviewSummary } from './review-summary'
export function Receipt({
  recipient,
  amount,
  reference,
  date,
}: {
  recipient: string
  amount: string
  reference: string
  date: string
}) {
  return (
    <section className="ds-receipt">
      <div className="receipt-heading">
        <CheckCircle size={20} />
        <h3 className="type-h3">Payment receipt</h3>
      </div>
      <ReviewSummary
        variant="subtle"
        title="Transaction details"
        fields={[
          { label: 'Beneficiary', value: recipient },
          { label: 'Amount', value: amount },
          { label: 'Method', value: 'Pix' },
          { label: 'Date', value: date },
          { label: 'Identifier', value: reference },
        ]}
      />
    </section>
  )
}
