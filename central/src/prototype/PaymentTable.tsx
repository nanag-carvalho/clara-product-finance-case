import type { ReactNode } from 'react'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import {
  Button,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system'
import { money, type State } from './flow-model'
import { displayDate, requestDate, type PaymentSort } from './payment-queue'
import { StatusBadge } from './PaymentFeedback'
import { ResponsivePaymentTable } from './ResponsivePaymentTable'

type Props = {
  visiblePayments: readonly State[]
  overview: boolean
  reviewQueue: boolean
  tablePage: number
  sortOrder: PaymentSort
  selected: string[]
  total: number
  selectPage: ReactNode
  onSort: (sort: PaymentSort) => void
  onSelect: (intent: string) => void
  onOpen: (intent: string, review: boolean) => void
  onClearSelection: () => void
}
/** Desktop and mobile share the same records and actions; this view never changes payment state. */
export function PaymentTable({
  visiblePayments,
  overview,
  reviewQueue,
  tablePage,
  sortOrder,
  selected,
  total,
  selectPage,
  onSort,
  onSelect,
  onOpen,
  onClearSelection,
}: Props) {
  const sortableHead = (
    label: string,
    ascending: PaymentSort,
    descending: PaymentSort,
  ) => {
    const active = sortOrder === ascending || sortOrder === descending
    return (
      <TableHead
        className={label === 'Amount' ? 'numeric' : undefined}
        aria-sort={
          overview
            ? undefined
            : active
              ? sortOrder === ascending
                ? 'ascending'
                : 'descending'
              : 'none'
        }
      >
        {overview ? (
          label
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="proto-sort-heading"
            aria-label={
              'Sort by ' +
              label +
              (active
                ? sortOrder === ascending
                  ? ' descending'
                  : ' ascending'
                : ' ascending')
            }
            onClick={() =>
              onSort(sortOrder === ascending ? descending : ascending)
            }
          >
            {label}
            {active ? (
              sortOrder === ascending ? (
                <ArrowUp size={13} />
              ) : (
                <ArrowDown size={13} />
              )
            ) : null}
          </Button>
        )}
      </TableHead>
    )
  }
  const desktopPaymentTable = (
    <Table aria-label="Supplier payments">
      <TableHeader>
        <TableRow>
          {!overview && (
            <TableHead className="proto-selection-cell">{selectPage}</TableHead>
          )}
          {sortableHead('Updated', 'oldest', 'newest')}
          {sortableHead('Recipient', 'supplier', 'supplier-desc')}
          {sortableHead('Amount', 'amount-low', 'amount')}
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visiblePayments
          .slice(
            overview ? 0 : tablePage * 10,
            overview ? 5 : (tablePage + 1) * 10,
          )
          .map((p) => (
            <TableRow
              key={p.intent}
              data-state={selected.includes(p.intent) ? 'selected' : undefined}
            >
              {!overview && (
                <TableCell className="proto-selection-cell">
                  <Checkbox
                    aria-label={'Select payment ' + p.intent}
                    checked={selected.includes(p.intent)}
                    onCheckedChange={() => onSelect(p.intent)}
                  />
                </TableCell>
              )}
              <TableCell>
                <time dateTime={requestDate(p)}>
                  {displayDate(requestDate(p))}
                </time>
              </TableCell>
              <TableCell>
                <strong>{p.recipient || 'Payment draft'}</strong>
                <p className="type-caption">{p.intent}</p>
              </TableCell>
              <TableCell className="numeric">{money(p.amount)}</TableCell>
              <TableCell>{p.bank}</TableCell>
              <TableCell>
                <StatusBadge stage={p.stage} />
              </TableCell>
              <TableCell>
                <Button
                  variant="link"
                  onClick={() =>
                    onOpen(p.intent, reviewQueue && p.stage === 'approval')
                  }
                >
                  {reviewQueue && p.stage === 'approval'
                    ? 'Review request'
                    : 'View payment'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
  const mobileSort = (
    <Select
      value={sortOrder}
      onValueChange={(value) => onSort(value as PaymentSort)}
    >
      <SelectTrigger aria-label="Sort payments">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Latest update</SelectItem>
        <SelectItem value="oldest">Oldest update</SelectItem>
        <SelectItem value="amount-low">Amount: low to high</SelectItem>
        <SelectItem value="amount">Amount: high to low</SelectItem>
        <SelectItem value="supplier">Recipient: A–Z</SelectItem>
        <SelectItem value="supplier-desc">Recipient: Z–A</SelectItem>
      </SelectContent>
    </Select>
  )
  const paymentTable = (
    <ResponsivePaymentTable
      total={total}
      onClearSelection={onClearSelection}
      table={desktopPaymentTable}
      rows={visiblePayments
        .slice(
          overview ? 0 : tablePage * 10,
          overview ? 5 : (tablePage + 1) * 10,
        )
        .map((p) => ({
          id: p.intent,
          recipient: p.recipient || 'Payment draft',
          amount: money(p.amount),
          source: p.bank,
          date: displayDate(requestDate(p)),
          dateTime: requestDate(p),
          status: <StatusBadge stage={p.stage} />,
          action:
            reviewQueue && p.stage === 'approval'
              ? 'Review request'
              : 'View payment',
          review: reviewQueue && p.stage === 'approval',
        }))}
      selectPage={overview ? undefined : selectPage}
      sortControl={overview ? undefined : mobileSort}
      selected={selected}
      onSelect={onSelect}
      onOpen={onOpen}
    />
  )
  return paymentTable
}
