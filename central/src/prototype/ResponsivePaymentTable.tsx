/** One payment dataset, two density patterns: a scannable desktop table and readable mobile rows. Selection and sorting remain consistent across layouts. */
import { useState, type ReactNode } from 'react'
import { Button, Checkbox } from '@/design-system'
type Row = {
  id: string
  recipient: string
  amount: string
  source: string
  date: string
  dateTime: string
  status: ReactNode
  action: string
  review: boolean
}
/** Retains the desktop table and presents the same records as readable mobile rows. */
export function ResponsivePaymentTable({
  table,
  rows,
  total,
  onClearSelection,
  selectPage,
  sortControl,
  selected,
  onSelect,
  onOpen,
}: {
  table: ReactNode
  rows: Row[]
  total?: number
  onClearSelection?: () => void
  selectPage?: ReactNode
  sortControl?: ReactNode
  selected: string[]
  onSelect: (id: string) => void
  onOpen: (id: string, review: boolean) => void
}) {
  const [selectionMode, setSelectionMode] = useState(false)
  const selecting = selectionMode || selected.length > 0
  return (
    <>
      <div className="proto-desktop-payment-table">{table}</div>
      <div className="proto-mobile-payment-list">
        {(selectPage || sortControl) && (
          <div className="proto-mobile-list-toolbar">
            <span className="type-caption">
              {total ?? rows.length} payments
            </span>
            <div className="proto-mobile-list-actions">
              {sortControl}
              {selectPage && (
                <Button
                  variant="outline"
                  aria-pressed={selecting}
                  onClick={() => {
                    if (selecting) {
                      setSelectionMode(false)
                      onClearSelection?.()
                    } else setSelectionMode(true)
                  }}
                >
                  {selecting ? 'Cancel' : 'Select'}
                </Button>
              )}
            </div>
            {selecting && selectPage && (
              <label className="proto-mobile-select-page">
                {selectPage}
                <span>Select this page</span>
              </label>
            )}
          </div>
        )}
        {rows.map((row) => (
          <article
            key={row.id}
            className="proto-mobile-payment-row"
            data-selected={selected.includes(row.id) || undefined}
          >
            <div
              className="proto-mobile-payment-heading"
              data-selecting={selecting || undefined}
            >
              {selectPage && selecting && (
                <label className="proto-mobile-row-select">
                  <Checkbox
                    aria-label={'Select payment ' + row.id}
                    checked={selected.includes(row.id)}
                    onCheckedChange={() => onSelect(row.id)}
                  />
                  <span className="sr-only">Select request</span>
                </label>
              )}
              <div>
                <strong>{row.recipient}</strong>
                <p className="type-caption">{row.id}</p>
              </div>
              <strong className="numeric">{row.amount}</strong>
            </div>
            <div className="proto-mobile-payment-meta">
              <span className="type-ui">{row.source}</span>
              {row.status}
            </div>
            <div className="proto-mobile-payment-footer">
              <time className="type-caption" dateTime={row.dateTime}>
                {row.date}
              </time>
              <Button variant="link" onClick={() => onOpen(row.id, row.review)}>
                {row.action}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
