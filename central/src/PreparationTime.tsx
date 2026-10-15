import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
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

export default function PreparationTime() {
  const [situationId, setSituationId] = useState('repeat')
  const situation =
    situations.find((item) => item.id === situationId) ?? situations[0]
  const { payments, first } = situation
  const assumptions = defaultTimeAssumptions
  const result = estimatePreparationTime(assumptions, payments, first)
  const fundingShare = assumptions.topUpSeconds / payments
  const explanation = first
    ? 'Connection adds setup to the proposed route. In this example, first use takes longer even though the separate top-up is removed.'
    : payments === 1
      ? 'The model replaces 2 minutes of bank access, top-up and return with 10 seconds of source choice. Preparing and reviewing the request takes the same time.'
      : `Only ${duration(fundingShare)} of the shared top-up is attributed to each request. Replacing that with 10 seconds of source choice leaves a much smaller difference.`
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
          The change: pay from the bank account without sending a separate Pix
          to fund Clara first.
        </p>
        <span className="preparation-model-label">
          Illustrative simulation · not measured
        </span>
      </header>
      <div className="preparation-situation">
        <label htmlFor="time-situation">Compare a situation</label>
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
        <p className="preparation-context">{situation.context}</p>
        <div className="preparation-paths">
          <div className="preparation-path">
            <p className="preparation-path-label">BEFORE · FUND CLARA FIRST</p>
            <strong className="preparation-total">
              {duration(result.before)}
            </strong>
            <span className="preparation-total-label">
              Active preparation per request
            </span>
            <ol>
              <li>
                <span>
                  {payments === 1
                    ? 'Top up Clara and return'
                    : `Share one top-up across ${payments} requests`}
                </span>
                <strong>{duration(fundingShare)}</strong>
              </li>
              <li>
                <span>Prepare and review</span>
                <strong>{duration(assumptions.commonSeconds)}</strong>
              </li>
            </ol>
          </div>
          <div className="preparation-path preparation-path-proposed">
            <p className="preparation-path-label">AFTER · PAY FROM YOUR BANK</p>
            <strong className="preparation-total">
              {duration(result.after)}
            </strong>
            <span className="preparation-total-label">
              Active preparation per request
            </span>
            <ol>
              {first && (
                <li>
                  <span>Connect the bank</span>
                  <strong>{duration(assumptions.connectionSeconds)}</strong>
                </li>
              )}
              <li>
                <span>Prepare and review</span>
                <strong>{duration(assumptions.commonSeconds)}</strong>
              </li>
              <li>
                <span>Choose the source</span>
                <strong>{duration(assumptions.sourceSeconds)}</strong>
              </li>
            </ol>
          </div>
        </div>
        <div className="preparation-outcome">
          <strong>
            {duration(Math.abs(result.saved))}{' '}
            {result.saved >= 0 ? 'less' : 'more'} active time per request
          </strong>
          <p>{explanation}</p>
        </div>
      </div>
      <p className="preparation-scope">
        This compares preparation up to submitting a correct request for company
        review. Approval and payment authorization still follow.
      </p>
      <details className="preparation-assumptions">
        <summary>Assumptions and sources</summary>
        <p>
          These are analyst-selected inputs, not observed timings. I hold detail
          entry and review equal to isolate the funding change. One top-up may
          fund several requests; the model shares its effort across them.
        </p>
        <dl className="preparation-input-summary">
          <div>
            <dt>Prepare and review</dt>
            <dd>90s in both routes</dd>
          </div>
          <div>
            <dt>Top up and return</dt>
            <dd>120s per funding operation</dd>
          </div>
          <div>
            <dt>Choose a source</dt>
            <dd>10s per request</dd>
          </div>
          <div>
            <dt>First connection</dt>
            <dd>120s once, when needed</dd>
          </div>
        </dl>
        <p>
          Before = details/review + top-up ÷ payments. After = details/review +
          source choice + first connection, when selected. Company approval,
          payment authorization and passive waiting are outside this preparation
          model; a full-task study must measure them separately, including bank
          redirection.
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
