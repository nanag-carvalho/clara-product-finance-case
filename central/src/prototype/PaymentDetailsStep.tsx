import { CheckCircle } from '@phosphor-icons/react'
import {
  Button,
  FileUpload,
  Input,
  InputGroup,
  Label,
  Skeleton,
  Spinner,
  Stack,
  Textarea,
} from '@/design-system'
import { amountCents, type State } from './flow-model'
import { recognizePix } from './pix-input'
type Details = Pick<
  State,
  | 'key'
  | 'amount'
  | 'recipient'
  | 'recipientDocument'
  | 'recipientBank'
  | 'description'
  | 'attachment'
  | 'error'
>
type Props = {
  details: Details
  busy: boolean
  findingRecipient: boolean
  onLookup: () => void
  onScanQr: () => void
  onFieldChange: (field: 'key' | 'amount', value: string) => void
  onContextChange: (field: 'description' | 'attachment', value: string) => void
}
/** Capture and recognize payment details. The controller owns lookup and validation transitions. */
export function PaymentDetailsStep({
  details,
  busy,
  findingRecipient,
  onLookup,
  onScanQr,
  onFieldChange,
  onContextChange,
}: Props) {
  const pixInput = recognizePix(details.key)
  return (
    <>
      <Stack gap={4}>
        <div className="proto-pix-label">
          <Label htmlFor="proto-key">Pix key or Copia e Cola code</Label>
          <Button variant="link" size="sm" onClick={onScanQr}>
            Scan QR
          </Button>
        </div>
        <InputGroup
          id="proto-key"
          actionLayout="responsive"
          trailing={
            <Button
              variant="ghost"
              size="sm"
              loading={findingRecipient}
              loadingLabel="Checking Pix"
              onClick={onLookup}
            >
              Find recipient
            </Button>
          }
          placeholder="Paste a key or Pix code"
          disabled={busy}
          value={details.key}
          aria-invalid={Boolean(details.error && !details.recipient)}
          onChange={(e) => onFieldChange('key', e.target.value)}
          aria-describedby="proto-key-help"
        />
        <p
          className="type-caption"
          role={details.error && !details.recipient ? 'alert' : undefined}
          id="proto-key-help"
        >
          {details.error && !details.recipient
            ? details.error
            : pixInput.error ||
              (pixInput.kind
                ? `${pixInput.kind} detected`
                : 'Email, CPF/CNPJ, mobile phone, random key or Pix code — type identified automatically.')}
        </p>
      </Stack>
      {findingRecipient && (
        <div
          className="proto-feedback-skeleton"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner />
          <div>
            <p className="type-caption">Finding the Pix recipient…</p>
            <Skeleton className="proto-skeleton-name" />
            <Skeleton className="proto-skeleton-detail" />
          </div>
        </div>
      )}
      {details.recipient && !findingRecipient && (
        <section
          className="proto-recipient-summary proto-feedback-enter"
          aria-label="Identified Pix recipient"
          role="status"
        >
          <div>
            <CheckCircle size={16} aria-hidden="true" />
            <strong className="type-h3">{details.recipient}</strong>
          </div>
          <p className="type-ui">
            {details.recipientDocument}
            <span aria-hidden="true"> · </span>
            {details.recipientBank}
          </p>
          <p className="type-caption">
            Check the name and document before continuing.
          </p>
        </section>
      )}
      <Stack gap={4}>
        <Label htmlFor="proto-amount">Amount in BRL</Label>
        <Input
          id="proto-amount"
          disabled={busy || Boolean(details.recipient && pixInput.amount)}
          aria-invalid={Boolean(details.error && !amountCents(details.amount))}
          inputMode="decimal"
          value={details.amount}
          onChange={(e) => onFieldChange('amount', e.target.value)}
          aria-describedby="proto-amount-help"
        />
        <p
          className="type-caption"
          role={
            details.error && !amountCents(details.amount) ? 'alert' : undefined
          }
          id="proto-amount-help"
        >
          {details.error && !amountCents(details.amount)
            ? 'Enter a positive amount with up to two decimal places.'
            : ''}
        </p>
      </Stack>
      <details className="proto-payment-history proto-optional-details">
        <summary>Description and supporting document (optional)</summary>
        <Stack gap={16}>
          <Stack gap={4}>
            <Label htmlFor="proto-description">Payment description</Label>
            <Textarea
              id="proto-description"
              maxLength={240}
              value={details.description}
              onChange={(e) => onContextChange('description', e.target.value)}
              placeholder="Invoice number or reason for this payment"
            />
          </Stack>
          <FileUpload
            variant="inline"
            label="Supporting document"
            selectedName={details.attachment}
            onChange={(file) => onContextChange('attachment', file?.name ?? '')}
          />
        </Stack>
      </details>
    </>
  )
}
