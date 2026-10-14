import test from 'node:test'
import assert from 'node:assert/strict'
import {
  initialWorkspace,
  workspaceReducer,
  type Workspace,
  type WorkspaceAction,
} from '../src/prototype/workspace.ts'
const run = (s: Workspace, ...actions: WorkspaceAction[]) =>
  actions.reduce(workspaceReducer, s)
const pending = () =>
  run(
    initialWorkspace('P1'),
    { type: 'REGISTER_ACCOUNT', bank: 'Example Bank A' },
    { type: 'NEW_PAYMENT', intent: 'P1' },
    { type: 'LOOKUP' },
    { type: 'REVIEW' },
    { type: 'CONNECT' },
    { type: 'REQUEST' },
  )
test('new payment preserves pending request and its approval dependency', () => {
  const s = run(pending(), { type: 'NEW_PAYMENT', intent: 'P2' })
  assert.equal(s.intent, 'P2')
  assert.equal(s.stage, 'entry')
  assert.equal(s.payments[0].stage, 'approval')
  assert.equal(s.payments[0].intent, 'P1')
  const reopened = run(
    s,
    { type: 'OPEN_PAYMENT', intent: 'P1' },
    { type: 'AUTHORIZE' },
  )
  assert.equal(reopened.stage, 'approval')
  assert.equal(reopened.payments[0].intent, 'P2')
  assert.ok(reopened.connected)
})
test('service response for archived intent cannot settle the new draft', () => {
  let s = run(
    pending(),
    { type: 'APPROVE', actor: 'approver' },
    { type: 'AUTHORIZE' },
    { type: 'SEND' },
  )
  const attempt = s.attempt
  s = run(
    s,
    { type: 'NEW_PAYMENT', intent: 'P2' },
    { type: 'RESULT', outcome: 'success', attempt, value: 'P1' },
  )
  assert.equal(s.stage, 'entry')
  assert.equal(s.payments[0].stage, 'paid')
  assert.equal(s.intent, 'P2')
})
test('opening saved requests preserves edits to the other draft', () => {
  let s = run(
    pending(),
    { type: 'NEW_PAYMENT', intent: 'P2' },
    { type: 'FIELD', field: 'amount', value: '200.00' },
    { type: 'OPEN_PAYMENT', intent: 'P1' },
    { type: 'OPEN_PAYMENT', intent: 'P2' },
  )
  assert.equal(s.amount, '200.00')
  assert.equal(s.payments.length, 1)
  assert.equal(s.payments[0].stage, 'approval')
})
test('populated and empty fixtures expose distinct working contexts', () => {
  const populated = workspaceReducer(initialWorkspace('EMPTY'), {
    type: 'LOAD_DATA',
    value: 'populated',
  })
  assert.equal(populated.accounts.length, 2)
  assert.equal(populated.payments.length, 11)
  assert.equal(
    populated.payments.filter((p) => p.stage === 'approval').length,
    3,
  )
  assert.ok(populated.payments.some((p) => p.stage === 'unknown'))
  assert.ok(populated.payments.some((p) => p.stage === 'failed'))
  const empty = workspaceReducer(populated, {
    type: 'LOAD_DATA',
    value: 'empty',
  })
  assert.equal(empty.payments.length, 0)
  assert.equal(empty.accounts.length, 0)
})
test('payment started from a connected account retains that selected source', () => {
  let s = workspaceReducer(initialWorkspace('EMPTY'), {
    type: 'LOAD_DATA',
    value: 'populated',
  })
  s = workspaceReducer(s, {
    type: 'NEW_PAYMENT',
    intent: 'NEW',
    bank: 'Example Bank B',
  })
  assert.equal(s.bank, 'Example Bank B')
  assert.equal(s.connected, true)
  assert.equal(s.stage, 'entry')
  assert.equal(s.payments.length, 11)
})

test('bulk approval records separate decisions without submitting any payment', () => {
  let s = workspaceReducer(initialWorkspace('demo'), {
    type: 'LOAD_DATA',
    value: 'populated',
  })
  s = workspaceReducer(s, {
    type: 'BULK_DECISION',
    intents: ['DEMO-001', 'DEMO-002'],
    decision: 'approve',
    actor: 'approver',
  })
  const chosen = s.payments.filter((p) =>
    ['DEMO-001', 'DEMO-002'].includes(p.intent),
  )
  assert.equal(chosen.length, 2)
  assert.ok(
    chosen.every(
      (p) => p.stage === 'authorize' && p.approved && p.attempt === 0,
    ),
  )
  assert.ok(
    chosen.every((p) => p.events.at(-1)?.title === 'Company approval recorded'),
  )
})
test('bulk decision rejects invalid roles, mixed states and rejection without a reason', () => {
  const s = workspaceReducer(initialWorkspace('demo'), {
    type: 'LOAD_DATA',
    value: 'populated',
  })
  for (const action of [
    {
      type: 'BULK_DECISION',
      intents: ['DEMO-001'],
      decision: 'approve',
      actor: 'requester',
    },
    {
      type: 'BULK_DECISION',
      intents: ['DEMO-001', 'DEMO-007'],
      decision: 'approve',
      actor: 'approver',
    },
    {
      type: 'BULK_DECISION',
      intents: ['DEMO-001'],
      decision: 'reject',
      actor: 'approver',
      reason: ' ',
    },
  ] as const)
    assert.equal(
      workspaceReducer(s, { ...action, intents: [...action.intents] }),
      s,
    )
  const rejected = workspaceReducer(s, {
    type: 'BULK_DECISION',
    intents: ['DEMO-001', 'DEMO-002'],
    decision: 'reject',
    actor: 'approver',
    reason: 'Invoice mismatch',
  })
  assert.ok(
    rejected.payments
      .filter((p) => ['DEMO-001', 'DEMO-002'].includes(p.intent))
      .every(
        (p) =>
          p.stage === 'rejected' && p.rejectionReason === 'Invoice mismatch',
      ),
  )
})

test('repeated payment creation cannot duplicate a saved intent', () => {
  const s = run(pending(), { type: 'NEW_PAYMENT', intent: 'P2' })
  assert.equal(workspaceReducer(s, { type: 'NEW_PAYMENT', intent: 'P1' }), s)
  assert.equal(workspaceReducer(s, { type: 'NEW_PAYMENT', intent: 'P2' }), s)
})
test('scenario reduction is reproducible and uses the supplied clock', () => {
  const s = initialWorkspace('demo')
  const action = {
    type: 'LOAD_SCENARIO',
    value: 'rejected',
    at: '2026-10-14T16:00:00.000Z',
  } as const
  const result = workspaceReducer(s, action)
  assert.deepEqual(workspaceReducer(s, action), result)
  assert.equal(result.events.at(-1)?.dateTime, action.at)
})
