import {
  authorizationRoute,
  routeDescription,
  type BankSupport,
} from './bank-capabilities'
import { Info, Bank } from '@phosphor-icons/react'
import {
  Alert,
  AlertTitle,
  AlertDescription,
  BrandMark,
  BrandLoading,
  Button,
  FlowState,
  Label,
  RadioGroup,
  RadioGroupItem,
  ReviewSummary,
  Skeleton,
  Spinner,
  Stack,
  Wizard,
} from '@/design-system'
import { Completion } from './PaymentFeedback'
export type BankSetupPhase =
  'list' | 'choose' | 'permission' | 'bank' | 'device' | 'done'
type Props = {
  bankSupport: BankSupport
  setup: BankSetupPhase
  setSetup: (phase: BankSetupPhase) => void
  setupBank: string
  setSetupBank: (bank: string) => void
  setupError: string
  transition: string | null
  advanceSetup: () => void
}
/** Account setup has its own task boundary: consent, bank return and device confirmation. */
export function BankConnectionWizard({
  bankSupport,
  setup,
  setSetup,
  setupBank,
  setSetupBank,
  setupError,
  transition,
  advanceSetup,
}: Props) {
  const route = authorizationRoute(bankSupport, setupBank)
  return (
    <Wizard
      titleLeading={<BrandMark />}
      busyContent={
        transition === 'device' ? (
          <BrandLoading label="Securing this device" />
        ) : undefined
      }
      open={setup !== 'list'}
      onOpenChange={(value) => {
        if (!value && !transition) setSetup('list')
      }}
      title={
        setup === 'choose'
          ? 'Choose your bank'
          : setup === 'permission'
            ? 'Connect this bank account'
            : setup === 'bank'
              ? 'Confirm the connection at your bank'
              : setup === 'device'
                ? 'Enable secure payments'
                : 'Bank account connected'
      }
      steps={
        route === 'device'
          ? ['Bank', 'Permission', 'Bank confirmation', 'Device']
          : ['Bank', 'Permission', 'Bank confirmation']
      }
      current={Math.max(
        0,
        ['choose', 'permission', 'bank', 'device'].indexOf(setup),
      )}
      showProgress={setup !== 'done'}
      description={setup === 'done' ? null : undefined}
      closeLabel={setup === 'done' ? 'Done' : 'Cancel'}
      onBack={
        transition
          ? undefined
          : setup === 'permission'
            ? () => setSetup('choose')
            : setup === 'bank'
              ? () => setSetup('permission')
              : undefined
      }
      actions={
        <Button
          disabled={route === 'unavailable' && setup !== 'done'}
          loading={!!transition}
          loadingLabel={
            setup === 'bank' ? 'Receiving bank confirmation' : 'Securing device'
          }
          onClick={advanceSetup}
        >
          {setup === 'done'
            ? 'Back to accounts'
            : setup === 'choose'
              ? 'Continue'
              : setup === 'permission'
                ? 'Continue to bank'
                : setup === 'bank'
                  ? 'Continue after bank confirmation'
                  : 'Confirm with device'}
        </Button>
      }
    >
      <Stack
        gap={16}
        className={transition === 'device' ? 'proto-finalizing' : undefined}
      >
        {setupError && (
          <Alert variant="destructive">
            <Info size={16} />
            <AlertTitle>Connection not completed</AlertTitle>
            <AlertDescription>{setupError}</AlertDescription>
          </Alert>
        )}
        {setup === 'choose' ? (
          <RadioGroup
            aria-label="Bank to link"
            value={setupBank}
            onValueChange={setSetupBank}
          >
            {['Example Bank A', 'Example Bank B'].map((bank, i) => (
              <Label
                key={bank}
                htmlFor={`proto-link-${i}`}
                className={`proto-account-choice ${setupBank === bank ? 'selected' : ''}`}
              >
                <Bank size={20} />
                <span>
                  <strong>{bank}</strong>
                  <span>
                    {routeDescription[authorizationRoute(bankSupport, bank)]}
                  </span>
                </span>
                <RadioGroupItem
                  id={`proto-link-${i}`}
                  value={bank}
                  disabled={
                    authorizationRoute(bankSupport, bank) === 'unavailable'
                  }
                />
              </Label>
            ))}
          </RadioGroup>
        ) : setup === 'permission' ? (
          <>
            <ReviewSummary
              variant="subtle"
              title="Existing account to connect"
              fields={[{ label: 'Bank', value: setupBank }]}
            />
            <p className="type-ui">
              Allow Clara to initiate payments from this business account.
              {route === 'bank'
                ? 'Authorize each payment at your bank and return to the saved request in Clara.'
                : 'Review and authorize each payment on the linked device.'}
            </p>
            <p className="type-ui">
              {route === 'bank'
                ? 'Confirm the account at your bank. This connection does not authorize a payment.'
                : 'Confirm the account at your bank, then secure the link on this device.'}
            </p>
          </>
        ) : setup === 'done' ? (
          <Completion
            title="Bank account connected"
            description={
              setupBank +
              (route === 'bank'
                ? ' is ready. Payments require bank authorization.'
                : ' is ready for payments on this device.')
            }
          />
        ) : (
          <FlowState
            kind={
              transition === 'connection'
                ? 'processing'
                : setup === 'bank'
                  ? 'setup'
                  : 'security'
            }
            title={
              setup === 'bank'
                ? 'Your bank confirms the account'
                : 'Account confirmed · secure this device'
            }
            description={
              setup === 'bank'
                ? 'Sign in at your bank, select your business account and approve the connection. Then return to Clara.'
                : 'Back in Clara, confirm with your device’s biometrics or passcode to finish connecting the account.'
            }
            owner="Clara"
          />
        )}
        {transition === 'connection' && (
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
        )}
        {setup === 'bank' && !transition && (
          <Alert>
            <Info size={16} />
            <AlertTitle>Prototype boundary</AlertTitle>
            <AlertDescription>
              The bank’s screens are outside this prototype. Continue to explore
              the return to Clara with an account confirmation received.
            </AlertDescription>
          </Alert>
        )}
        {setup === 'device' && (
          <ReviewSummary
            variant="subtle"
            title="Account returned by the bank"
            fields={[
              { label: 'Account holder', value: 'Example Company Ltd.' },
              { label: 'Bank', value: setupBank },
              {
                label: 'Business account',
                value: '•• ' + (setupBank.endsWith('A') ? '4321' : '8765'),
              },
            ]}
          />
        )}
      </Stack>
    </Wizard>
  )
}
