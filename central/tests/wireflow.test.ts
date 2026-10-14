import test from 'node:test'
import assert from 'node:assert/strict'
import {initialState,reducer} from '../src/wireflow/model.ts'
import type {Action,State} from '../src/wireflow/model.ts'
const run=(s:State,...actions:Action[])=>actions.reduce(reducer,s)
const review=()=>run(initialState(),{type:'START'},{type:'LOOKUP'},{type:'REVIEW'},{type:'CONNECT'},{type:'CONNECTED'})
test('payment details precede source preparation and invalid details block continuation',()=>{
 let s=reducer(initialState(),{type:'START'});assert.equal(s.stage,'entry')
 assert.equal(reducer(s,{type:'REVIEW'}).stage,'entry')
 s=run(s,{type:'LOOKUP'},{type:'REVIEW'});assert.equal(s.stage,'connect')
 s=run(s,{type:'CONNECT'},{type:'CANCEL_CONNECTION'});assert.equal(s.stage,'connect');assert.equal(s.amount,'1750.00');assert.ok(s.recipient)
})
test('prepared source skips setup; choosing a different source requires setup',()=>{
 let s=run(initialState(true),{type:'START'},{type:'LOOKUP'},{type:'REVIEW'});
 assert.equal(reducer(s,{type:'CONNECT'}).stage,'review')
 s=run(s,{type:'BANK',bank:'Example Bank B'},{type:'CONNECT'});assert.equal(s.stage,'bank-connect')
})
test('editing source preserves recipient and amount; failure requires renewed approval',()=>{
 let s=review();assert.equal(s.stage,'review')
 s=run(s,{type:'EDIT',value:'source'});assert.equal(s.stage,'connect');assert.ok(s.recipient)
 s=run(s,{type:'CONNECT'},{type:'REQUEST'},{type:'APPROVE'},{type:'AUTHORIZE'},{type:'SEND'});
 s=reducer(s,{type:'RESULT',outcome:'failed',attempt:s.attempt});s=reducer(s,{type:'RETRY'});
 assert.equal(s.stage,'review');assert.equal(s.approved,false);assert.equal(reducer(s,{type:'SEND'}).stage,'review')
})
test('unknown outcome keeps same intent and prevents another submission',()=>{
 let s=run(review(),{type:'REQUEST'},{type:'APPROVE'},{type:'AUTHORIZE'},{type:'SEND'});
 s=reducer(s,{type:'RESULT',outcome:'unknown',attempt:s.attempt});const attempt=s.attempt
 s=run(s,{type:'SEND'},{type:'RETRY'},{type:'EDIT'});assert.equal(s.stage,'unknown');assert.equal(s.attempt,attempt)
 s=reducer(s,{type:'CHECK',outcome:'success',value:s.intent});assert.equal(s.stage,'paid');assert.equal(s.intent,'WIRE-001')
})

test('independent account setup preserves draft and prepared accounts across source changes',()=>{
 let s=run(initialState(),{type:'REGISTER_ACCOUNT',bank:'Example Bank A'},{type:'REGISTER_ACCOUNT',bank:'Example Bank B'},{type:'START'},{type:'LOOKUP'},{type:'REVIEW'});
 s=reducer(s,{type:'BANK',bank:'Example Bank B'});assert.equal(s.connected,true)
 s=reducer(s,{type:'BANK',bank:'Example Bank A'});assert.equal(s.connected,true)
 assert.equal(reducer(s,{type:'CONNECT'}).stage,'review');assert.equal(s.amount,'1750.00');assert.equal(s.accounts.length,2)
})
