import type { ReactNode } from 'react'
import { ArrowRight, Bank, CreditCard } from '@phosphor-icons/react'
import {
  Badge,
  Banner,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  FlowIllustration,
  FlowState,
  Pressable,
  Stack,
} from '@/design-system'
import type { State } from './flow-model'
import type { WorkspaceView } from './ProductNavigation'
import { FundingMenu } from './FundingMenu'
export type PaymentQueueScope = 'all' | 'approval' | 'authorize' | 'processing'
type Props = {
  view: WorkspaceView
  accounts: readonly string[]
  allPayments: readonly State[]
  paymentFilter: PaymentQueueScope
  queueCount: number
  searchMatches: number
  paymentTable: ReactNode
  filters: ReactNode
  bulkBar: ReactNode
  pagination: ReactNode
  onQueue: (scope: PaymentQueueScope) => void
  onViewAll: () => void
  onNewPayment: () => void
  onPayFrom: (bank: string) => void
  onConnect: () => void
  onClearFilters: () => void
}
/** Compose workspace views from shared primitives and controlled data.
 * Navigation and financial commands stay with the controller. */
export function WorkspaceViews({
  view,
  accounts,
  allPayments,
  paymentFilter,
  queueCount,
  searchMatches,
  paymentTable,
  filters,
  bulkBar,
  pagination,
  onQueue,
  onViewAll,
  onNewPayment,
  onPayFrom,
  onConnect,
  onClearFilters,
}: Props) {
  const pendingCount = allPayments.filter(
    (payment) => payment.stage === 'approval',
  ).length
  return (
    <>
      {view === 'overview' && (
        <div className="proto-overview-bento">
          <div className="proto-overview-intro">
            <Banner
              tone="brand"
              title="Pay from the account that holds your funds"
              description="Create a Pix with your business bank account, company review and secure confirmation."
              actions={<FundingMenu align="start" onExternal={onNewPayment} />}
              visual={<FlowIllustration kind="setup" />}
            />
          </div>
          <Card className="proto-overview-attention">
            <CardHeader>
              <CardTitle>Needs attention</CardTitle>
              <CardDescription>
                Continue from the current payment state.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Stack gap={8}>
                {(
                  [
                    ['approval', 'Company review', pendingCount],
                    [
                      'authorize',
                      'Ready to authorize',
                      allPayments.filter((p) => p.stage === 'authorize').length,
                    ],
                    [
                      'processing',
                      'Awaiting confirmation',
                      allPayments.filter((p) =>
                        ['processing', 'unknown'].includes(p.stage),
                      ).length,
                    ],
                  ] as const
                ).map(([filter, label, count]) => (
                  <Pressable
                    key={filter}
                    className="proto-overview-queue"
                    onClick={() => {
                      onQueue(filter)
                    }}
                  >
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <ArrowRight size={16} />
                  </Pressable>
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card className="proto-overview-recent">
            <CardHeader className="proto-card-heading">
              <div>
                <CardTitle>Recently updated payments</CardTitle>
              </div>
              <Button
                variant="link"
                onClick={() => {
                  onViewAll()
                }}
              >
                View all payments
                <ArrowRight size={16} />
              </Button>
            </CardHeader>
            <CardContent>
              {allPayments.length ? (
                paymentTable
              ) : (
                <EmptyState
                  variant="plain"
                  title="No payments yet"
                  description="Requests and their latest status will appear here."
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {view === 'accounts' && (
        <Stack gap={16}>
          {accounts.length ? (
            accounts.map((bank) => (
              <Card key={bank}>
                <CardContent className="proto-account-card">
                  <Bank size={24} />
                  <div>
                    <strong>{bank}</strong>
                    <p className="type-ui">
                      Business account · ••{' '}
                      {bank.endsWith('A') ? '4321' : '8765'}
                    </p>
                    <Badge variant="outline">Connected on this device</Badge>
                  </div>
                  <Button variant="outline" onClick={() => onPayFrom(bank)}>
                    Pay from this account
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <FlowState
              kind="setup"
              title="No bank accounts connected"
              description="Connect an existing business account to pay suppliers through Clara. Confirm it at your bank, then enable secure payments on this device."
              action={
                <Button onClick={() => onConnect()}>
                  Connect bank account
                </Button>
              }
            />
          )}
        </Stack>
      )}

      {view === 'payments' && (
        <Stack gap={16}>
          <div
            className="proto-summary-controls"
            role="group"
            aria-label="Filter payment queue"
          >
            {(
              [
                ['all', 'All payments', allPayments.length],
                ['approval', 'Pending approval', pendingCount],
                [
                  'authorize',
                  'Ready to authorize',
                  allPayments.filter((p) => p.stage === 'authorize').length,
                ],
                [
                  'processing',
                  'Processing',
                  allPayments.filter((p) =>
                    ['processing', 'unknown'].includes(p.stage),
                  ).length,
                ],
              ] as const
            ).map(([filter, label, count]) => (
              <Pressable
                key={filter}
                className="proto-summary-control"
                aria-pressed={paymentFilter === filter}
                onClick={() => {
                  onQueue(filter)
                }}
              >
                <span>{label}</span>
                <strong>{count}</strong>
              </Pressable>
            ))}
          </div>
          <Card className="proto-payment-queue">
            <CardContent>
              <Stack key={paymentFilter} gap={16} className="proto-queue-enter">
                {paymentFilter !== 'all' && queueCount > 0 && (
                  <div className="proto-queue-banner" aria-live="polite">
                    <FlowState
                      kind={
                        paymentFilter === 'approval'
                          ? 'waiting'
                          : paymentFilter === 'authorize'
                            ? 'ready'
                            : 'processing'
                      }
                      title={
                        paymentFilter === 'approval'
                          ? `${queueCount} ${queueCount === 1 ? 'request is' : 'requests are'} waiting for approval`
                          : paymentFilter === 'authorize'
                            ? `${queueCount} ${queueCount === 1 ? 'payment is' : 'payments are'} ready to authorize`
                            : `Checking ${queueCount} ${queueCount === 1 ? 'payment' : 'payments'}`
                      }
                      description={
                        paymentFilter === 'approval'
                          ? 'Review the saved requests before payment authorization.'
                          : paymentFilter === 'authorize'
                            ? 'Open a payment to authorize it with the linked device.'
                            : 'Waiting for a confirmed result. Check uncertain payments using the same request.'
                      }
                      owner={
                        paymentFilter === 'approval'
                          ? 'Company approvers'
                          : paymentFilter === 'authorize'
                            ? 'Authorized representative'
                            : 'Payment service'
                      }
                      next={
                        paymentFilter === 'approval'
                          ? 'Authorization after the required decision'
                          : paymentFilter === 'authorize'
                            ? 'Open the payment and authorize'
                            : 'Confirmed outcome or a supported recovery action'
                      }
                    />
                  </div>
                )}
                {allPayments.length > 0 && filters}
                {bulkBar}
                {queueCount > 0 && searchMatches === 0 ? (
                  <EmptyState
                    variant="plain"
                    title="No matching payments"
                    description="Adjust your search or filters."
                    action={
                      <Button variant="outline" onClick={onClearFilters}>
                        Clear filters
                      </Button>
                    }
                  />
                ) : queueCount > 0 ? (
                  paymentTable
                ) : (
                  <EmptyState
                    variant="plain"
                    title={
                      paymentFilter === 'all'
                        ? 'Your supplier payments start here'
                        : 'No payments in this queue'
                    }
                    description={
                      paymentFilter === 'all'
                        ? 'Create a Pix using the account that holds your funds.'
                        : 'Payments appear here when they reach this state.'
                    }
                    icon={<CreditCard size={24} />}
                    action={
                      paymentFilter === 'all' ? (
                        <FundingMenu onExternal={onNewPayment} />
                      ) : (
                        <Button variant="outline" onClick={onViewAll}>
                          View all payments
                        </Button>
                      )
                    }
                  />
                )}{' '}
                {queueCount > 0 && pagination}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}
    </>
  )
}
