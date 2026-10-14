import { amountCents, type State } from './flow-model.ts'
export type PaymentSort =
  'newest' | 'oldest' | 'amount' | 'amount-low' | 'supplier' | 'supplier-desc'
export type QueueFilters = {
  query: string
  source: string
  status: string
  period: string
  dateFrom: string
  dateTo: string
}
export const requestDate = (payment: Pick<State, 'events' | 'createdAt'>) =>
  payment.events.at(-1)?.dateTime ?? payment.createdAt
export const displayDate = (date?: string) =>
  date
    ? new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Draft'
/** Keep queue selection pure: desktop and mobile consume the same filtered order. */
export function selectPaymentQueue(
  payments: State[],
  filters: QueueFilters,
  sort: PaymentSort,
  now = new Date(),
): State[] {
  const query = filters.query.trim().toLocaleLowerCase()
  return payments
    .filter((payment) => {
      const date = requestDate(payment)
      return (
        (!query ||
          payment.recipient.toLocaleLowerCase().includes(query) ||
          payment.intent.toLocaleLowerCase().includes(query)) &&
        (filters.source === 'all' || payment.bank === filters.source) &&
        (filters.status === 'all' || payment.stage === filters.status) &&
        (filters.period === 'all' ||
          (filters.period === 'today'
            ? new Date(date).toDateString() === now.toDateString()
            : (!filters.dateFrom ||
                date >=
                  new Date(filters.dateFrom + 'T00:00:00').toISOString()) &&
              (!filters.dateTo ||
                date <=
                  new Date(filters.dateTo + 'T23:59:59.999').toISOString())))
      )
    })
    .sort((a, b) =>
      sort === 'newest'
        ? requestDate(b).localeCompare(requestDate(a))
        : sort === 'oldest'
          ? requestDate(a).localeCompare(requestDate(b))
          : sort === 'amount'
            ? amountCents(b.amount) - amountCents(a.amount)
            : sort === 'amount-low'
              ? amountCents(a.amount) - amountCents(b.amount)
              : sort === 'supplier-desc'
                ? b.recipient.localeCompare(a.recipient)
                : a.recipient.localeCompare(b.recipient),
    )
}
/** Selecting a page preserves selections on other pages; clearing a page removes only its IDs. */
export function selectPageIds(
  selected: string[],
  pageIds: string[],
  checked: boolean,
): string[] {
  const otherPages = selected.filter((id) => !pageIds.includes(id))
  return checked ? [...otherPages, ...pageIds] : otherPages
}
