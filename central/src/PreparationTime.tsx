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
  ArrowDown,
  ArrowRight,
  Check,
  Minus,
  Plus,
} from '@phosphor-icons/react'
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
const routines = [
  {
    id: 'repeat',
    label: 'A top-up is needed for each payment',
    payments: 1,
    first: false,
    prefunded: false,
    context:
      'The money is at another bank. The proposed route can use an already connected, eligible account.',
    before: 'Transfer money into Clara first',
    beforeNote: 'A separate funding task before preparing this request.',
    conclusion: 'One funding dependency is removed.',
    meaning:
      'This could help when a request waits for someone to fund Clara. Test whether using the intended bank directly reduces that coordination while preserving the required decisions.',
  },
  {
    id: 'shared-five',
    label: 'One top-up funds 5 payments',
    payments: 5,
    first: false,
    prefunded: false,
    context:
      'The team funds five requests together. The proposed bank account is already connected.',
    before: 'Fund five requests with one transfer',
    beforeNote: 'The funding effort is already shared across the run.',
    conclusion: 'The existing routine already shares the funding work.',
    meaning:
      'The new route must earn its place through source choice and continuity. Repeated bank authorization could add work, so compare the full payment run rather than assuming a time saving.',
  },
  {
    id: 'first',
    label: 'The bank needs a first connection',
    payments: 1,
    first: true,
    prefunded: false,
    context:
      'The money is at another bank, and the team has not connected that account to Clara yet.',
    before: 'Transfer money into Clara first',
    beforeNote: 'The existing bank-to-Clara funding route.',
    conclusion: 'Setup adds work now; usefulness depends on later needs.',
    meaning:
      'First connection includes consent and bank confirmation. A longer first task can still be worthwhile if the team chooses this route again; setup completion alone does not establish value.',
  },
  {
    id: 'prefunded',
    label: 'Clara already has enough funds',
    payments: 1,
    first: false,
    prefunded: true,
    context:
      'The next supplier request can already use the Clara balance. An external account is also available.',
    before: 'Use the available Clara balance',
    beforeNote: 'No new top-up is needed for this request.',
    conclusion: 'There is no funding dependency to remove for this request.',
    meaning:
      'The existing route may fit better here. Keep Clara balance available and investigate whether an external source is useful for an exception or a later payment.',
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
  const [routineId, setRoutineId] = useState('repeat')
  const [assumptions, setAssumptions] = useState({ ...defaultTimeAssumptions })
  const routine = routines.find((item) => item.id === routineId) ?? routines[0]
  const { payments, first, prefunded } = routine
  const activeAssumptions = prefunded
    ? { ...assumptions, topUpSeconds: 0 }
    : assumptions
  const result = estimatePreparationTime(activeAssumptions, payments, first)
  const fundingShare = activeAssumptions.topUpSeconds / payments
  const difference =
    result.saved === 0
      ? 'Same active time'
      : `${duration(Math.abs(result.saved))} ${result.saved > 0 ? 'less' : 'more'} active time`
  return (
    <section
      className="preparation-time showcase-panel showcase-panel-soft"
      aria-labelledby="preparation-time-title"
    >
      <header className="preparation-heading">
        <p className="eyebrow">COMPARE THE FUNDING ROUTINE</p>
        <h3 id="preparation-time-title">What changes for this team?</h3>
        <p>
          Choose the current routine. Follow the work that is removed, retained
          or added.
        </p>
      </header>
      <div className="preparation-situation">
        <label htmlFor="time-situation">How is the next payment funded?</label>
        <Select value={routineId} onValueChange={setRoutineId}>
          <SelectTrigger id="time-situation">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {routines.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="preparation-comparison">
        <p className="preparation-context">{routine.context}</p>
        <div
          className="funding-interpretation"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>WHAT TO TAKE FROM THIS</span>
          <h4>{routine.conclusion}</h4>
          <p>{routine.meaning}</p>
        </div>
        <div className="funding-workflows">
          <div className="funding-workflow">
            <h4>Current route</h4>
            <div className="funding-step">
              <span className="funding-step-type">
                {prefunded ? <Check size={14} /> : <Minus size={14} />}
                {prefunded ? 'Already available' : 'Funding prerequisite'}
              </span>
              <strong>{routine.before}</strong>
              <p>{routine.beforeNote}</p>
            </div>
            <ArrowDown
              className="funding-step-arrow"
              size={18}
              aria-hidden="true"
            />
            <div className="funding-step funding-step-common">
              <span className="funding-step-type">
                <Check size={14} /> Retained
              </span>
              <strong>Prepare and review the request</strong>
              <p>Recipient, amount and the payment details.</p>
            </div>
          </div>
          <div className="funding-workflow funding-workflow-proposed">
            <h4>Proposed route</h4>
            <div className="funding-step">
              <span className="funding-step-type">
                {first ? <Plus size={14} /> : <ArrowRight size={14} />}
                {first ? 'One-time setup' : 'Source choice'}
              </span>
              <strong>
                {first
                  ? 'Connect the bank, then choose the source'
                  : 'Choose an eligible connected bank'}
              </strong>
              <p>
                {first
                  ? 'Consent and bank confirmation are required before first use.'
                  : 'A separate transfer into Clara is not required.'}
              </p>
            </div>
            <ArrowDown
              className="funding-step-arrow"
              size={18}
              aria-hidden="true"
            />
            <div className="funding-step funding-step-common">
              <span className="funding-step-type">
                <Check size={14} /> Retained
              </span>
              <strong>Prepare and review the request</strong>
              <p>Recipient, amount and the named source account.</p>
            </div>
          </div>
        </div>
        <p className="funding-shared-boundary">
          <Check size={16} aria-hidden="true" /> Both routes still require the
          applicable company decisions, payment authorization and a traceable
          result.
        </p>
      </div>
      <details className="preparation-assumptions">
        <summary>Explore the assumed preparation time</summary>
        <p>
          Optional sensitivity check · these seconds are assumptions, not
          observed timings. Change an input to see which part of the estimate
          moves.
        </p>
        <div className="preparation-editable-inputs">
          {assumptionFields.map((field) => (
            <label key={field.key}>
              <span>{field.label}</span>
              <div className="preparation-seconds">
                <Input
                  aria-label={field.label}
                  type="number"
                  disabled={
                    (field.key === 'connectionSeconds' && !first) ||
                    (field.key === 'topUpSeconds' && prefunded)
                  }
                  min="0"
                  max="3600"
                  step="1"
                  value={activeAssumptions[field.key]}
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
              <small>
                {field.key === 'topUpSeconds' && prefunded
                  ? 'No top-up is needed in the selected routine.'
                  : field.note}
              </small>
            </label>
          ))}
        </div>
        <div className="preparation-equations">
          <div>
            <span>Current route</span>
            <p>
              {duration(assumptions.commonSeconds)} preparation +{' '}
              {prefunded
                ? 'no new top-up'
                : payments > 1
                  ? `${duration(activeAssumptions.topUpSeconds)} top-up ÷ ${payments} requests`
                  : `${duration(fundingShare)} top-up`}
            </p>
            <strong>{duration(result.before)} per request</strong>
          </div>
          <div>
            <span>Proposed route</span>
            <p>
              {duration(assumptions.commonSeconds)} preparation +{' '}
              {duration(assumptions.sourceSeconds)} source choice
              {first
                ? ` + ${duration(assumptions.connectionSeconds)} connection`
                : ''}
            </p>
            <strong>{duration(result.after)} per request</strong>
          </div>
        </div>
        <div className="preparation-numeric-result" aria-live="polite">
          <strong>{difference} per request with these inputs.</strong>
          <p>
            {first
              ? 'This includes first-use setup. It does not measure the value of later payments.'
              : payments > 1
                ? 'The existing top-up cost is divided across the requests it funds. This is an effort allocation, not a faster observed top-up.'
                : prefunded
                  ? 'The existing route has no funding work to remove in this example.'
                  : 'The difference comes from replacing the assumed top-up effort with source choice.'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAssumptions({ ...defaultTimeAssumptions })}
        >
          Reset assumptions
        </Button>
        <p className="preparation-scope">
          Preparation only, up to submitting a correct request for company
          review. Company approval, payment authorization and passive waiting
          are outside this calculation. It cannot estimate adoption, convenience
          or business value.
        </p>
      </details>
      <details className="preparation-sources">
        <summary>Sources behind the funding steps</summary>
        <p>
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
          document the steps. They do not supply a measured time baseline. These
          comparisons are working hypotheses about the routine.
        </p>
      </details>
      <a
        className="showcase-detail-link"
        href="/#/approach?section=solution-value"
        target="clara-case-hub"
      >
        Customer fit, measures and validation plan ↗
      </a>
    </section>
  )
}
