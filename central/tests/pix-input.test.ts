import test from 'node:test'
import assert from 'node:assert/strict'
import { recognizePix, demoPixCode } from '../src/prototype/pix-input.ts'
import { initialState, reducer } from '../src/prototype/flow-model.ts'
test('Pix recognition distinguishes keys, ambiguous numbers and malformed documents', () => {
  assert.equal(recognizePix(' PIX@EXAMPLE.TEST ').key, 'pix@example.test')
  assert.equal(recognizePix('+55 (11) 99999-9999').kind, 'Mobile phone')
  assert.equal(
    recognizePix('52998224725').kind,
    'CPF / phone · confirmed by lookup',
  )
  assert.equal(recognizePix('529.982.247-25').kind, 'CPF')
  assert.ok(recognizePix('529.982.247-00').error)
  assert.equal(
    recognizePix('123e4567-e89b-12d3-a456-426614174000').kind,
    'Random key',
  )
})
test('Copia e Cola validates integrity and keeps encoded amount during lookup', () => {
  const input = recognizePix(demoPixCode)
  assert.equal(input.kind, 'Pix Copia e Cola')
  assert.equal(input.amount, '1750.00')
  assert.ok(recognizePix(demoPixCode.replace('1750.00', '1751.00')).error)
  const state = {
    ...initialState(),
    stage: 'entry' as const,
    key: demoPixCode,
    amount: '2.00',
  }
  const result = reducer(state, { type: 'LOOKUP' })
  assert.equal(result.recipient, 'Example Supplier Ltd.')
  assert.equal(result.amount, '1750.00')
})
