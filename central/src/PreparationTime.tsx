import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Button,
} from '@/design-system'
import {
  defaultTimeAssumptions,
  estimatePreparationTime,
} from './payment-time-model'

const duration = (seconds: number) => {
  const rounded = Math.round(seconds)
  return rounded < 60
    ? `${rounded}s`
    : `${Math.floor(rounded / 60)}m ${String(rounded % 60).padStart(2, '0')}s`
}
const situations = [
  {
    id: 'repeat',
    label: 'Repeat use · 1 payment per top-up',
    payments: 1,
    first: false,
    context:
      'Your bank is already connected. In the existing route, this request needs its own top-up.',
  },
  {
    id: 'shared-five',
    label: 'Repeat use · 5 payments per top-up',
    payments: 5,
    first: false,
    context:
      'Your bank is already connected. One top-up funds five requests, so its effort is shared across them.',
  },
  {
    id: 'shared-ten',
    label: 'Repeat use · 10 payments per top-up',
    payments: 10,
    first: false,
    context:
      'Your bank is already connected. One top-up funds ten requests, leaving little funding effort per request.',
  },
  {
    id: 'first',
    label: 'First use · connect a bank',
    payments: 1,
    first: true,
    context:
      'The proposal needs a first bank connection. The existing route needs one top-up for this request.',
  },
]

const assumptionFields = [
  {
    key: 'topUpSeconds',
    label: 'Bank access, top-up and return',
    note: 'Per top-up, shared across the selected number of requests.',
  },
  {
    key: 'commonSeconds',
    label: 'Prepare and review the request',
    note: 'The same effort is applied to both routes.',
  },
  {
    key: 'sourceSeconds',
    label: 'Choose the source account',
    note: 'Per request in the proposed route.',
  },
  {
    key: 'connectionSeconds',
    label: 'First bank connection',
    note: 'Added only when first use is selected.',
  },
] as const

export default function PreparationTime() {
  const [situationId, setSituationId] = useState('repeat')
  const [assumptions, setAssumptions] = useState({ ...defaultTimeAssumptions })
  const situation =
    situations.find((item) => item.id === situationId) ?? situations[0]
  const { payments, first } = situation
  const result = estimatePreparationTime(assumptions, payments, first)
  const fundingShare = assumptions.topUpSeconds / payments
  const percentage =
    result.before > 0
      ? Math.round((Math.abs(result.saved) / result.before) * 100)
      : null
  const saving = result.saved > 0
  const equal = result.saved === 0
  const explanation = first
    ? 'First use includes connection and consent. That setup is added once; it is excluded from repeat-use estimates.'
    : payments === 1
      ? 'The separate top-up is replaced by source choice. Preparing and reviewing the request stays the same.'
      : `The existing route already shares top-up effort across ${payments} requests. Only ${duration(fundingShare)} is attributed to each one, so the potential saving is smaller.`
  const rows = [
    {
      label: 'Prepare and review',
      before: assumptions.commonSeconds,
      after: assumptions.commonSeconds,
    },
    {
      label:
        payments === 1
          ? 'Top up Clara and return'
          : `Top-up effort ÷ ${payments} requests`,
      before: fundingShare,
      after: null,
    },
    {
      label: 'Choose the source',
      before: null,
      after: assumptions.sourceSeconds,
    },
    ...(first
      ? [
          {
            label: 'Connect the bank',
            before: null,
            after: assumptions.connectionSeconds,
          },
        ]
      : []),
  ]
  return (
    <section
      className="preparation-time showcase-panel showcase-panel-soft"
      aria-labelledby="preparation-time-title"
    >
      <header className="preparation-heading">
        <p className="eyebrow">PREPARATION TIME</p>
        <h3 id="preparation-time-title">
          What could removing the top-up save?
        </h3>
        <p>
          Pay from the bank account without sending a separate Pix to fund Clara
          first.
        </p>
        <span className="preparation-model-label">
          Simulation · assumed timings, not measured results
        </span>
      </header>
      <div className="preparation-situation">
        <label htmlFor="time-situation">1. Choose the routine to compare</label>
        <Select value={situationId} onValueChange={setSituationId}>
          <SelectTrigger id="time-situation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {situations.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        className="preparation-comparison"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="preparation-result"
          data-outcome={equal ? 'equal' : saving ? 'saving' : 'overhead'}
        >
          <div>
            <p className="preparation-result-label">
              {equal
                ? 'NO ESTIMATED TIME DIFFERENCE'
                : saving
                  ? 'ESTIMATED PREPARATION SAVED'
                  : first
                    ? 'ESTIMATED FIRST-USE OVERHEAD'
                    : 'ESTIMATED EXTRA PREPARATION'}
            </p>
            <strong>
              {equal
                ? 'Same active time'
                : `${duration(Math.abs(result.saved))} ${saving ? 'less' : 'more'} active time`}
            </strong>
            <span>
              per request · {duration(result.before)} before →{' '}
              {duration(result.after)} proposed
            </span>
          </div>
          {percentage !== null && !equal && (
            <span className="preparation-percent">
              {percentage}% {saving ? 'less' : 'more'}
              <small>in this model</small>
            </span>
          )}
        </div>
        <p className="preparation-explanation">{explanation}</p>
        <div className="preparation-breakdown">
          <h4>2. See where the difference comes from</h4>
          <table>
            <caption className="sr-only">
              Estimated active seconds per request, using the same preparation
              effort in both routes
            </caption>
            <thead>
              <tr>
                <th scope="col">Active work</th>
                <th scope="col">
                  Before<small>Fund Clara first</small>
                </th>
                <th scope="col">
                  Proposed<small>Use your bank</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.before === null ? '—' : duration(row.before)}</td>
                  <td>{row.after === null ? '—' : duration(row.after)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total per request</th>
                <td>{duration(result.before)}</td>
                <td>{duration(result.after)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <details className="preparation-assumptions">
        <summary>3. Change the time assumptions</summary>
        <p>
          Enter assumed active seconds. The estimate updates immediately;
          preparing and reviewing stays equal in both routes.
        </p>
        <div className="preparation-editable-inputs">
          {assumptionFields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              <div className="preparation-seconds">
                <Input
                  aria-label={field.label}
                  type="number"
                  disabled={field.key === 'connectionSeconds' && !first}
                  min="0"
                  max="3600"
                  step="1"
                  value={assumptions[field.key]}
                  onChange={(event) =>
                    setAssumptions((previous) => ({
                      ...previous,
                      [field.key]: Math.min(
                        3600,
                        Math.max(0, Number(event.target.value)),
                      ),
                    }))
                  }
                />
                <span aria-hidden="true">seconds</span>
              </div>
              <small>{field.note}</small>
            </label>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAssumptions({ ...defaultTimeAssumptions })}
        >
          Reset assumptions
        </Button>
      </details>
      <p className="preparation-scope">
        Scope of this simulation: preparation up to submitting a correct request
        for company review. Company approval, payment authorization and passive
        waiting are excluded from this simulation.
      </p>
      <details className="preparation-sources">
        <summary>Sources and calculation</summary>
        <p>
          Before = preparation + top-up effort ÷ requests funded. Proposed =
          preparation + source choice + first connection when selected.
        </p>
        <p className="preparation-evidence">
          Clara’s{' '}
          <a
            href="https://ajuda.clara.com/hc/pt-br/articles/28754949605651"
            target="_blank"
            rel="noreferrer"
          >
            funding guide
          </a>{' '}
          and{' '}
          <a
            href="https://ajuda.clara.com/hc/pt-br/articles/31709462299155"
            target="_blank"
            rel="noreferrer"
          >
            Pix guide
          </a>{' '}
          support the steps, not their duration. I found no comparable measured
          baseline in these sources.
        </p>
      </details>
      <a
        className="showcase-detail-link"
        href="/#/approach?section=solution-validation"
        target="clara-case-hub"
      >
        Baseline, sources and study plan ↗
      </a>
    </section>
  )
}
