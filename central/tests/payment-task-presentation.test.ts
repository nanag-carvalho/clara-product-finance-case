import test from 'node:test'
import assert from 'node:assert/strict'
import { getPaymentTaskPresentation } from '../src/prototype/payment-task-presentation.ts'
const context = {
  stage: 'entry' as const,
  bank: 'Example Bank A',
  reviewAsApprover: false,
  deviceLinked: false,
  qrOpen: false,
  editNotice: '',
  transition: null,
}
test('an approver receipt does not look like another authorization step', () => {
  const receipt = getPaymentTaskPresentation({
    ...context,
    stage: 'authorize',
    reviewAsApprover: true,
  })
  assert.equal(receipt.approvalReceipt, true)
  assert.equal(receipt.showProgress, false)
  assert.equal(receipt.description, null)
  const authorization = getPaymentTaskPresentation({
    ...context,
    stage: 'authorize',
  })
  assert.equal(authorization.approvalReceipt, false)
  assert.equal(authorization.showProgress, true)
})
test('scanner entry suppresses the payment progress without advancing its phase', () => {
  const scanner = getPaymentTaskPresentation({ ...context, qrOpen: true })
  assert.equal(scanner.showProgress, false)
  assert.equal(scanner.current, 0)
  assert.equal(
    getPaymentTaskPresentation({ ...context, stage: 'review' }).current,
    2,
  )
})
test('processing and unknown outcomes never present a completed payment', () => {
  const processing = getPaymentTaskPresentation({
    ...context,
    stage: 'processing',
  })
  assert.ok(processing.busyLabel)
  assert.equal(processing.showProgress, false)
  const unknown = getPaymentTaskPresentation({ ...context, stage: 'unknown' })
  assert.equal(unknown.busyLabel, undefined)
  assert.equal(unknown.footerNote, 'Tracking this request')
  assert.notEqual(unknown.title, 'Paid')
})
