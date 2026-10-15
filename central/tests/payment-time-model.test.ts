import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultTimeAssumptions,
  estimatePreparationTime,
} from '../src/payment-time-model.ts'

test('preparation estimates expose setup cost and amortized funding instead of assuming a universal saving', () => {
  const repeat = estimatePreparationTime(defaultTimeAssumptions, 1, false)
  assert.deepEqual(repeat, { before: 210, after: 100, saved: 110 })
  const sharedTopUp = estimatePreparationTime(defaultTimeAssumptions, 10, false)
  assert.equal(sharedTopUp.saved, 2)
  const first = estimatePreparationTime(defaultTimeAssumptions, 1, true)
  assert.equal(first.after, 220)
  assert.equal(first.saved, -10)
  assert.equal(
    estimatePreparationTime(
      { ...defaultTimeAssumptions, topUpSeconds: 0 },
      1,
      false,
    ).saved,
    -10,
  )
  assert.throws(
    () => estimatePreparationTime(defaultTimeAssumptions, 0, false),
    RangeError,
  )
  assert.throws(
    () =>
      estimatePreparationTime(
        { ...defaultTimeAssumptions, sourceSeconds: NaN },
        1,
        false,
      ),
    RangeError,
  )
})
