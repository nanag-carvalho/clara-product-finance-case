import { Bank, Info } from '@phosphor-icons/react'
import {
  Alert,
  AlertTitle,
  AlertDescription,
  FlowState,
  Label,
  RadioGroup,
  RadioGroupItem,
  ReviewSummary,
  Skeleton,
  Spinner,
} from '@/design-system'
type Props = {
  phase: 'connect' | 'bank-connect'
  bank: string
  connected: boolean
  accounts: readonly string[]
  deviceLinked: boolean
  receiving: boolean
  onBankChange: (bank: string) => void
}
/** Source identity and connection feedback; selection is distinct from payment authorization. */
export function SourceAccountStep({
  phase,
  bank: selectedBank,
  connected,
  accounts,
  deviceLinked,
  receiving,
  onBankChange,
}: Props) {
  return (
    <>
      {phase === 'connect' && (
        <>
          <RadioGroup
            aria-label="Pay from"
            value={selectedBank}
            onValueChange={(bank) => onBankChange(bank)}
          >
            {['Example Bank A', 'Example Bank B'].map((bank, i) => (
              <Label
                key={bank}
                htmlFor={`proto-source-${i}`}
                className={`proto-account-choice ${selectedBank === bank ? 'selected' : ''}`}
              >
                <Bank size={20} />
                <span>
                  <strong>{bank}</strong>
                  <span>
                    {accounts.includes(bank)
                      ? 'Business account · •• ' +
                        (bank.endsWith('A') ? '4321' : '8765')
                      : 'Select your business account during connection'}
                  </span>
                  <span className="type-caption">
                    {accounts.includes(bank)
                      ? 'Ready to use'
                      : 'Not connected yet'}
                  </span>
                </span>
                <RadioGroupItem id={`proto-source-${i}`} value={bank} />
              </Label>
            ))}
          </RadioGroup>
          <p className="type-ui">
            {connected
              ? 'This account is ready. Next, review the details and request company approval.'
              : 'Connect the selected bank first. You’ll confirm the account at your bank and secure this device on return. Your payment details stay saved.'}
          </p>
        </>
      )}
      {phase === 'bank-connect' && (
        <>
          <FlowState
            kind={
              receiving ? 'processing' : deviceLinked ? 'security' : 'setup'
            }
            title={
              receiving
                ? 'Receiving account confirmation'
                : deviceLinked
                  ? 'Account confirmed · secure this device'
                  : 'Your bank confirms the account'
            }
            description={
              deviceLinked
                ? 'Confirm with your device’s biometrics or passcode to enable secure payments in Clara.'
                : 'You’ll sign in at ' +
                  selectedBank +
                  ', select your business account and approve the connection, then return to Clara.'
            }
            owner="Clara"
          />
          {receiving ? (
            <div
              className="proto-feedback-skeleton"
              role="status"
              aria-busy="true"
            >
              <Spinner />
              <div>
                <p className="type-caption">
                  Checking the account returned to Clara…
                </p>
                <Skeleton className="proto-skeleton-name" />
                <Skeleton className="proto-skeleton-detail" />
              </div>
            </div>
          ) : deviceLinked ? (
            <ReviewSummary
              variant="subtle"
              title="Account returned by the bank"
              fields={[
                {
                  label: 'Account holder',
                  value: 'Example Company Ltd.',
                },
                {
                  label: 'Business account',
                  value: '•• ' + (selectedBank.endsWith('A') ? '4321' : '8765'),
                },
              ]}
            />
          ) : (
            <Alert>
              <Info size={16} />
              <AlertTitle>Prototype boundary</AlertTitle>
              <AlertDescription>
                The bank’s screens are outside this prototype. Continue to
                explore the return to Clara with an account confirmation
                received.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </>
  )
}
