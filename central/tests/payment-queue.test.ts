import test from 'node:test'
import assert from 'node:assert/strict'
import { initialState } from '../src/prototype/flow-model.ts'
import {
  selectPaymentQueue,
  selectPageIds,
} from '../src/prototype/payment-queue.ts'
const filters = {
  query: '',
  source: 'all',
  status: 'all',
  period: 'all',
  dateFrom: '',
  dateTo: '',
}
const payments = [
  {
    ...initialState('direct', 'A'),
    recipient: 'Atlas',
    amount: '100.00',
    bank: 'Bank A',
    stage: 'approval' as const,
    createdAt: '2026-10-14T12:00:00Z',
    events: [],
  },
  {
    ...initialState('direct', 'B'),
    recipient: 'Beta',
    amount: '200.00',
    bank: 'Bank B',
    stage: 'paid' as const,
    createdAt: '2026-10-13T12:00:00Z',
    events: [],
  },
]
test('queue combines source, status and case-insensitive trimmed search', () => {
  assert.deepEqual(
    selectPaymentQueue(
      payments,
      { ...filters, query: ' ATLAS ', source: 'Bank A', status: 'approval' },
      'newest',
    ).map((p) => p.intent),
    ['A'],
  )
  assert.equal(
    selectPaymentQueue(
      payments,
      { ...filters, query: 'Atlas', source: 'Bank B' },
      'newest',
    ).length,
    0,
  )
})
test('sorting does not mutate the workspace and today uses an explicit clock', () => {
  assert.deepEqual(
    selectPaymentQueue(payments, filters, 'amount').map((p) => p.intent),
    ['B', 'A'],
  )
  assert.deepEqual(
    payments.map((p) => p.intent),
    ['A', 'B'],
  )
  assert.deepEqual(
    selectPaymentQueue(
      payments,
      { ...filters, period: 'today' },
      'newest',
      new Date('2026-10-14T12:00:00Z'),
    ).map((p) => p.intent),
    ['A'],
  )
})
test('page selection preserves other pages and deselects only the current page', () => {
  assert.deepEqual(selectPageIds(['outside', 'A'], ['A', 'B'], true), [
    'outside',
    'A',
    'B',
  ])
  assert.deepEqual(selectPageIds(['outside', 'A', 'B'], ['A', 'B'], false), [
    'outside',
  ])
})
