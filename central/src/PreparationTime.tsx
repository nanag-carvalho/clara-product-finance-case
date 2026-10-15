import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from '@/design-system'
import {
  defaultTimeAssumptions,
  estimatePreparationTime,
} from './payment-time-model'

const duration = (seconds: number) =>
  `${Math.floor(Math.round(seconds) / 60)}m ${String(Math.round(seconds) % 60).padStart(2, '0')}s`
const assumptionLabels = {
  commonSeconds: 'Enter details and review · seconds',
  topUpSeconds: 'Bank access, top-up and return · seconds',
  sourceSeconds: 'Choose the source · seconds',
  connectionSeconds: 'First connection and consent · seconds',
}

export default function PreparationTime() {
  const [assumptions, setAssumptions] = useState(defaultTimeAssumptions)
  const [payments, setPayments] = useState(1)
  const [first, setFirst] = useState(false)
  const result = estimatePreparationTime(assumptions, payments, first)
  const longest = Math.max(result.before, result.after, 1)
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
          From starting the funding task to submitting a correct request for
          company review.
        </p>
        <span className="preparation-model-label">
          Illustrative simulation · not measured
        </span>
      </header>
      <div
        className="preparation-results"
        aria-live="polite"
        aria-atomic="true"
      >
        {(
          [
            ['Before', result.before],
            ['After', result.after],
          ] as const
        ).map(([label, seconds]) => (
          <div className="preparation-bar-row" key={label}>
            <span className="preparation-route-label">
              <strong>{label}</strong>
              <small>
                {label === 'Before'
                  ? 'Fund Clara, then prepare'
                  : 'Choose bank in the request'}
              </small>
            </span>
            <div className="preparation-track">
              <div style={{ width: `${(seconds / longest) * 100}%` }} />
            </div>
            <strong>{duration(seconds)}</strong>
          </div>
        ))}
        <p className="preparation-difference">
          <strong>
            {duration(Math.abs(result.saved))}{' '}
            {result.saved >= 0 ? 'less' : 'more'} active time per request
          </strong>
          <span>
            In this model ·{' '}
            {first ? 'first connection included' : 'account already connected'}
          </span>
        </p>
      </div>
      <div className="preparation-scenario">
        <h4>Change the situation</h4>{' '}
        <div className="preparation-controls">
          <label>
            Payments covered by one top-up
            <Select
              value={String(payments)}
              onValueChange={(value) => setPayments(Number(value))}
            >
              <SelectTrigger aria-label="Payments covered by one top-up">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 payment</SelectItem>
                <SelectItem value="5">5 payments</SelectItem>
                <SelectItem value="10">10 payments</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="preparation-checkbox">
            <Checkbox
              checked={first}
              onCheckedChange={(value) => setFirst(value === true)}
              aria-label="Include first connection"
            />{' '}
            Include first connection
          </label>
        </div>
      </div>
      <details className="preparation-assumptions">
        <summary>Assumptions and sources</summary>
        <p>
          These are analyst-selected inputs, not observed timings. I hold detail
          entry and review equal to isolate the funding change. One top-up may
          fund several requests; the model shares its effort across them.
        </p>
        <div className="preparation-inputs">
          {Object.entries(assumptionLabels).map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                type="number"
                min="0"
                max="3600"
                step="5"
                value={assumptions[key as keyof typeof assumptions]}
                onChange={(event) =>
                  setAssumptions((previous) => ({
                    ...previous,
                    [key]: Math.min(
                      3600,
                      Math.max(0, Number(event.target.value)),
                    ),
                  }))
                }
              />
            </label>
          ))}
        </div>
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
