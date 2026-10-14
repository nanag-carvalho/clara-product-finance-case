/** Workspace orchestration for multiple saved payments and deterministic demo scenarios. Scenarios exercise the same transitions as ordinary interactions. */
import {
  initialState,
  demoCreatedAt,
  reducer,
  type State,
  type Action,
} from './flow-model.ts'
export type Workspace = State & { payments: State[] }
export type Scenario =
  | 'first'
  | 'ready'
  | 'approval'
  | 'authorization'
  | 'rejected'
  | 'canceled'
  | 'expired'
  | 'balance'
  | 'limit'
  | 'unavailable'
  | 'unknown'
  | 'paid'
export type WorkspaceAction =
  | {
      type: 'BULK_DECISION'
      intents: string[]
      decision: 'approve' | 'reject'
      reason?: string
      actor?: 'approver' | 'requester'
      at?: string
    }
  | { type: 'LOAD_SCENARIO'; value: Scenario; at?: string }
  | { type: 'LOAD_DATA'; value: 'empty' | 'populated'; at?: string }
  | Action
  | { type: 'NEW_PAYMENT'; intent: string; bank?: string; at?: string }
  | { type: 'OPEN_PAYMENT'; intent: string; at?: string }
export const initialWorkspace = (
  intent: string,
  at = demoCreatedAt,
): Workspace => ({
  ...initialState('direct', intent, at),
  payments: [],
})
function snapshot({ payments, ...state }: Workspace): State {
  return state
}
export function workspaceReducer(s: Workspace, a: WorkspaceAction): Workspace {
  if (a.type === 'BULK_DECISION') {
    const targets = [
      ...s.payments,
      ...(s.stage === 'idle' ? [] : [snapshot(s)]),
    ].filter((p) => a.intents.includes(p.intent))
    if (
      a.actor !== 'approver' ||
      targets.length !== new Set(a.intents).size ||
      targets.some((p) => p.stage !== 'approval') ||
      (a.decision === 'reject' && !a.reason?.trim())
    )
      return s
    const action: Action =
      a.decision === 'approve'
        ? { type: 'APPROVE', actor: 'approver', at: a.at }
        : { type: 'REJECT', actor: 'approver', value: a.reason!, at: a.at }
    return {
      ...(a.intents.includes(s.intent) ? reducer(s, action) : s),
      payments: s.payments.map((p) =>
        a.intents.includes(p.intent) ? reducer(p, action) : p,
      ),
    }
  }
  if (a.type === 'BANK_SUPPORT')
    return {
      ...reducer(s, a),
      payments: s.payments.map((p) => reducer(p, a)),
    }
  if (a.type === 'LOAD_SCENARIO') {
    const loaded = scenarioWorkspace(a.value, a.at)
    return {
      ...loaded,
      bankSupport: s.bankSupport,
      payments: loaded.payments.map((p) => ({
        ...p,
        bankSupport: s.bankSupport,
      })),
    }
  }
  if (a.type === 'LOAD_DATA')
    return a.value === 'populated'
      ? populatedWorkspace()
      : initialWorkspace('DEMO-EMPTY', a.at)
  if (a.type === 'NEW_PAYMENT') {
    if (
      (s.stage !== 'idle' && a.intent === s.intent) ||
      s.payments.some((payment) => payment.intent === a.intent)
    )
      return s
    const draft = {
      ...initialState('direct', a.intent, a.at),
      bank: a.bank ?? 'Example Bank A',
    }
    return {
      ...reducer(
        {
          ...draft,
          accounts: s.accounts,
          bankSupport: s.bankSupport,
          connected: s.accounts.includes(draft.bank),
        },
        { type: 'START' },
      ),
      payments: s.stage === 'idle' ? s.payments : [...s.payments, snapshot(s)],
    }
  }
  if (a.type === 'EXPIRE_ACCOUNT')
    return { ...reducer(s, a), payments: s.payments.map((p) => reducer(p, a)) }
  if (a.type === 'OPEN_PAYMENT') {
    if (a.intent === s.intent) return s
    const chosen = s.payments.find((p) => p.intent === a.intent)
    if (!chosen) return s
    return {
      ...chosen,
      accounts: s.accounts,
      bankSupport: s.bankSupport,
      connected: s.accounts.includes(chosen.bank),
      payments: [
        ...s.payments.filter((p) => p.intent !== a.intent),
        ...(s.stage === 'idle' ? [] : [snapshot(s)]),
      ],
    }
  }
  if (
    (a.type === 'RESULT' || a.type === 'CHECK') &&
    a.value &&
    a.value !== s.intent
  )
    return {
      ...s,
      payments: s.payments.map((p) =>
        p.intent === a.value ? reducer(p, a) : p,
      ),
    }
  return { ...reducer(s, a), payments: a.type === 'RESET' ? [] : s.payments }
}

export function populatedWorkspace(): Workspace {
  const accounts = ['Example Bank A', 'Example Bank B']
  const samples: [State['stage'], string, string, string][] = [
    ['approval', 'Atlas Supplies', 'billing@atlas.test', '7320.50'],
    ['approval', 'Horizonte Services', 'finance@horizonte.test', '1750.00'],
    ['approval', 'Nova Logistics', 'pix@nova.test', '12890.00'],
    ['authorize', 'Aurora Software', 'pay@aurora.test', '25600.00'],
    ['authorize', 'Delta Consulting', 'billing@delta.test', '9870.00'],
    ['unknown', 'Solaris Energy', 'pix@solaris.test', '3200.00'],
    ['paid', 'Meridian Office', 'billing@meridian.test', '5480.00'],
    ['paid', 'Atlas Supplies', 'billing@atlas.test', '1840.00'],
    ['paid', 'Nova Logistics', 'pix@nova.test', '4200.00'],
    ['failed', 'Horizonte Services', 'finance@horizonte.test', '19650.00'],
    ['entry', '', 'payments@example-supplier.test', '890.00'],
  ]
  const payments = samples.map(([stage, recipient, key, amount], i): State => {
    const base = initialState(
      'direct',
      `DEMO-${String(i + 1).padStart(3, '0')}`,
    )
    const approved = ['authorize', 'unknown', 'paid', 'failed'].includes(stage),
      dateTime = new Date(Date.UTC(2026, 9, 14, 12, 0 - i * 7)).toISOString()
    return {
      ...base,
      stage,
      description: 'Supplier invoice ' + String(i + 1).padStart(3, '0'),
      attachment: i % 3 === 0 ? 'invoice-' + (i + 1) + '.pdf' : '',
      recipientDocument: recipient ? '••.•••.•••/0001-••' : '',
      recipientBank: recipient ? 'Example Recipient Bank' : '',
      createdAt: dateTime,
      bank: accounts[i % 2],
      accounts,
      connected: true,
      recipient,
      key,
      amount,
      approved,
      attempt: ['unknown', 'paid', 'failed'].includes(stage) ? 1 : 0,
      events:
        stage === 'entry'
          ? []
          : [
              {
                id: 'sample-event',
                title:
                  stage === 'approval'
                    ? 'Payment request submitted'
                    : stage === 'authorize'
                      ? 'Company approval recorded'
                      : stage === 'paid'
                        ? 'Supplier payment confirmed'
                        : stage === 'failed'
                          ? 'Payment failed — insufficient funds'
                          : 'Outcome awaiting confirmation',
                actor:
                  stage === 'approval'
                    ? 'Nágela · requester'
                    : stage === 'authorize'
                      ? 'Carlos · company approver'
                      : 'Payment service',
                dateTime,
                description:
                  stage === 'approval'
                    ? 'Waiting for company review.'
                    : stage === 'authorize'
                      ? 'Ready for payment authorization.'
                      : stage === 'paid'
                        ? 'Authoritative payment result received.'
                        : stage === 'failed'
                          ? 'No transfer completed.'
                          : 'Check this request before another submission.',
              },
            ],
    }
  })
  return {
    ...initialState('direct', 'DEMO-NEXT'),
    accounts,
    connected: true,
    payments,
  }
}

export function scenarioWorkspace(
  kind: Scenario,
  at = demoCreatedAt,
): Workspace {
  const populated = populatedWorkspace()
  let payment = populated.payments[0]
  if (kind === 'first' || kind === 'ready') {
    payment = {
      ...initialState(kind === 'ready', 'DEMO-SCENARIO', at),
      stage: 'entry',
      accounts: kind === 'ready' ? populated.accounts : [],
      connected: kind === 'ready',
    }
  } else if (
    kind === 'authorization' ||
    kind === 'expired' ||
    kind === 'canceled' ||
    ['balance', 'limit', 'unavailable', 'unknown', 'paid'].includes(kind)
  ) {
    payment = reducer(payment, { type: 'APPROVE', actor: 'approver', at })
    if (kind === 'expired')
      payment = reducer(payment, {
        type: 'EXPIRE_ACCOUNT',
        bank: payment.bank,
        at,
      })
    else if (kind !== 'authorization') {
      payment = reducer(payment, { type: 'AUTHORIZE', at })
      if (kind === 'canceled')
        payment = reducer(payment, { type: 'CANCEL_AUTH', at })
      else {
        payment = reducer(payment, { type: 'SEND', at })
        payment = reducer(payment, {
          type: 'RESULT',
          attempt: payment.attempt,
          outcome:
            kind === 'unknown'
              ? 'unknown'
              : kind === 'paid'
                ? 'success'
                : 'failed',
          reason:
            kind === 'limit'
              ? 'limit'
              : kind === 'unavailable'
                ? 'unavailable'
                : 'balance',
          at,
        })
      }
    }
  } else if (kind === 'rejected')
    payment = reducer(payment, {
      type: 'REJECT',
      actor: 'approver',
      value:
        'The invoice amount does not match the requested amount. Correct it and resend.',
      at,
    })
  return { ...payment, payments: [] }
}
