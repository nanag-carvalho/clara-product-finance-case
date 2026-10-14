import test from 'node:test'
import assert from 'node:assert/strict'
import { createDeferredTask } from '../src/prototype/deferred-task.ts'
function fixture() {
  const callbacks: (() => void)[] = []
  const task = createDeferredTask({
    schedule(callback) {
      callbacks.push(callback)
      return callbacks.length as unknown as ReturnType<typeof setTimeout>
    },
    cancel() {}, // Exercise a callback already queued by the clock.
  })
  return { task, callbacks }
}
test('repeated starts cannot execute one operation twice', () => {
  const { task, callbacks } = fixture()
  let submissions = 0
  assert.equal(
    task.run(() => submissions++, 800),
    true,
  )
  assert.equal(
    task.run(() => submissions++, 800),
    false,
  )
  callbacks[0]()
  assert.equal(submissions, 1)
  assert.equal(
    task.run(() => submissions++, 800),
    true,
  )
})
test('cancellation invalidates a callback already queued before switching context', () => {
  const { task, callbacks } = fixture()
  let result = ''
  task.run(() => {
    result = 'old request'
  }, 800)
  task.cancel()
  task.run(() => {
    result = 'new request'
  }, 800)
  callbacks[0]()
  assert.equal(result, '')
  callbacks[1]()
  assert.equal(result, 'new request')
})
