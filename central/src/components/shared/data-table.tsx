import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../ui/table'
import { EmptyState } from './empty-state'
export type DataRow = { id: string; [key: string]: string | number }
export type DataColumn = {
  key: string
  label: string
  numeric?: boolean
  render?: (row: DataRow) => ReactNode
}
export function DataTable({
  rows,
  columns,
  label = 'Records',
  pageSize: requestedPageSize = 5,
}: {
  rows: DataRow[]
  columns: DataColumn[]
  label?: string
  pageSize?: number
}) {
  const pageSize = Math.max(1, Math.floor(requestedPageSize) || 5)
  const [query, setQuery] = useState(''),
    [page, setPage] = useState(0),
    [sort, setSort] = useState<{ key: string; desc: boolean } | null>(null)
  const filtered = rows.filter((r) =>
    Object.values(r).some((v) =>
      String(v)
        .toLocaleLowerCase('en-US')
        .includes(query.toLocaleLowerCase('en-US')),
    ),
  )
  if (sort)
    filtered.sort(
      (a, b) =>
        (typeof a[sort.key] === 'number' && typeof b[sort.key] === 'number'
          ? Number(a[sort.key]) - Number(b[sort.key])
          : String(a[sort.key]).localeCompare(String(b[sort.key]), 'en-US', {
              numeric: true,
            })) * (sort.desc ? -1 : 1),
    )
  const total = Math.max(1, Math.ceil(filtered.length / pageSize)),
    current = Math.min(page, total - 1)
  return (
    <div className="ds-data-table">
      <Input
        aria-label={`Search ${label.toLowerCase()}`}
        placeholder="Search records…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setPage(0)
        }}
      />
      {!filtered.length ? (
        <EmptyState
          title="No records"
          description="Try another term or clear the search."
          action={
            <Button variant="outline" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
        />
      ) : (
        <Table aria-label={label}>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead
                  key={c.key}
                  aria-sort={
                    sort?.key === c.key
                      ? sort.desc
                        ? 'descending'
                        : 'ascending'
                      : 'none'
                  }
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSort({
                        key: c.key,
                        desc: sort?.key === c.key ? !sort.desc : false,
                      })
                      setPage(0)
                    }}
                  >
                    {c.label}
                    {sort?.key === c.key &&
                      (sort.desc ? (
                        <ArrowDown size={12} />
                      ) : (
                        <ArrowUp size={12} />
                      ))}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered
              .slice(current * pageSize, (current + 1) * pageSize)
              .map((r) => (
                <TableRow key={r.id}>
                  {columns.map((c) => (
                    <TableCell
                      key={c.key}
                      className={c.numeric ? 'numeric' : ''}
                    >
                      {c.render?.(r) ?? r[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      <div className="table-pagination">
        <span className="type-caption">
          {filtered.length} records · page {current + 1} of {total}
        </span>
        <div>
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={current === total - 1}
            onClick={() => setPage(current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
