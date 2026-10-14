import {reducer as paymentReducer,initialState as paymentInitialState,amountCents,type State,type Action} from '../prototype/model.ts'
export {money,demoKey} from '../prototype/model.ts'
export type {State,Action,Outcome} from '../prototype/model.ts'
export function initialState(prepared=false):State{return {...paymentInitialState('direct','WIRE-001'),connected:prepared}}
export function reducer(s:State,a:Action):State{
 if(a.type==='RESET')return initialState(a.value==='prepared')
 if(a.type==='START'&&s.stage==='idle')return {...s,stage:'entry'}
 if(a.type==='REVIEW'&&s.stage==='entry')return s.recipient&&amountCents(s.amount)?{...s,stage:'connect',approved:false,error:''}:{...s,error:'Find the recipient and enter a valid amount.'}
 if(a.type==='BANK'&&s.stage==='connect')return {...s,bank:a.bank??s.bank,connected:a.bank===s.bank?s.connected:false,approved:false}
 if(a.type==='CONNECT'&&s.stage==='connect')return {...s,stage:s.connected?'review':'bank-connect',error:''}
 if(a.type==='CONNECTED'&&s.stage==='bank-connect')return {...s,stage:'review',connected:true,error:''}
 if(a.type==='EDIT'&&s.stage==='connect')return {...s,stage:'entry',error:''}
 if(a.type==='EDIT'&&s.stage==='review'&&a.value==='source')return {...s,stage:'connect',approved:false,error:''}
 if(a.type==='RETRY'&&s.stage==='failed')return {...s,stage:'review',approved:false,error:'',notice:''}
 return paymentReducer(s,a)
}
