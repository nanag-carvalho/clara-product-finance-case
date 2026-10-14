import { MagnifyingGlass, SlidersHorizontal, X } from '@phosphor-icons/react'
import {
  Badge,
  Button,
  Input,
  InputGroup,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Stack,
} from '@/design-system'
import { PaymentFilterSurface } from './PaymentFilterSurface'
import { paymentStatusLabels as status } from './scenarios'
import type { Stage } from './flow-model'
import type { QueueFilters } from './payment-queue'

type Props = {
  value: QueueFilters
  showStatus: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (changes: Partial<QueueFilters>) => void
  onReset: () => void
}
/** Controlled queue filters share one query contract across desktop and mobile surfaces. */
export function PaymentFilters({
  value,
  showStatus,
  open,
  onOpenChange,
  onChange,
  onReset,
}: Props) {
  const activeFilters = [
    ...(value.source !== 'all'
      ? [{ label: value.source, clear: () => onChange({ source: 'all' }) }]
      : []),
    ...(value.period !== 'all'
      ? [
          {
            label: value.period === 'today' ? 'Updated today' : 'Custom dates',
            clear: () => onChange({ period: 'all' }),
          },
        ]
      : []),
    ...(value.status !== 'all' && showStatus
      ? [
          {
            label: status[value.status as Stage],
            clear: () => onChange({ status: 'all' }),
          },
        ]
      : []),
  ]
  const filters = (
    <Stack gap={8}>
      <div className="proto-table-filters">
        <InputGroup
          leadingIcon={<MagnifyingGlass size={16} />}
          placeholder="Search payments"
          aria-label="Search supplier or reference"
          value={value.query}
          onChange={(e) => onChange({ query: e.target.value })}
        />
        <PaymentFilterSurface
          open={open}
          onOpenChange={onOpenChange}
          trigger={
            <Button variant="outline">
              <SlidersHorizontal size={16} />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary">{activeFilters.length}</Badge>
              )}
            </Button>
          }
        >
          <div className="proto-filter-heading">
            <h3 className="type-h3">Filters</h3>
            <p className="type-caption">Results update as you select.</p>
          </div>
          <Stack gap={16}>
            <Stack gap={4}>
              <Label htmlFor="filter-bank">Source bank</Label>
              <Select
                value={value.source}
                onValueChange={(next) => onChange({ source: next })}
              >
                <SelectTrigger
                  id="filter-bank"
                  aria-label="Filter by source bank"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All banks</SelectItem>
                  {['Example Bank A', 'Example Bank B'].map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Stack>
            <Stack gap={4}>
              <Label htmlFor="filter-period">Updated</Label>
              <Select
                value={value.period}
                onValueChange={(next) => onChange({ period: next })}
              >
                <SelectTrigger
                  id="filter-period"
                  aria-label="Filter by update period"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All dates</SelectItem>
                  <SelectItem value="today">Updated today</SelectItem>
                  <SelectItem value="custom">Custom dates</SelectItem>
                </SelectContent>
              </Select>
            </Stack>
            {showStatus && (
              <Stack gap={4}>
                <Label htmlFor="filter-status">Payment status</Label>
                <Select
                  value={value.status}
                  onValueChange={(next) => onChange({ status: next })}
                >
                  <SelectTrigger
                    id="filter-status"
                    aria-label="Filter by payment status"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {(
                      [
                        'entry',
                        'approval',
                        'authorize',
                        'processing',
                        'unknown',
                        'paid',
                        'failed',
                        'rejected',
                      ] as const
                    ).map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {status[stage]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Stack>
            )}
            {value.period === 'custom' && (
              <>
                <Stack gap={4}>
                  <Label htmlFor="filter-from">Updated from</Label>
                  <Input
                    type="date"
                    id="filter-from"
                    value={value.dateFrom}
                    max={value.dateTo || undefined}
                    onChange={(e) => onChange({ dateFrom: e.target.value })}
                  />
                </Stack>
                <Stack gap={4}>
                  <Label htmlFor="filter-to">Updated until</Label>
                  <Input
                    type="date"
                    id="filter-to"
                    value={value.dateTo}
                    min={value.dateFrom || undefined}
                    onChange={(e) => onChange({ dateTo: e.target.value })}
                  />
                </Stack>
              </>
            )}
            <div className="proto-filter-footer">
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Done
              </Button>
            </div>
          </Stack>
        </PaymentFilterSurface>
      </div>
      {activeFilters.length > 0 && (
        <div className="proto-active-filters" aria-label="Applied filters">
          {activeFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="secondary"
              size="sm"
              onClick={filter.clear}
              aria-label={'Remove filter: ' + filter.label}
            >
              {filter.label}
              <X size={12} />
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={onReset}>
            Clear all
          </Button>
        </div>
      )}
    </Stack>
  )

  return filters
}
