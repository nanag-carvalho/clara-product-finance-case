import {reducer as paymentReducer,initialState as paymentInitialState,amountCents,type State as PaymentState,type Action as PaymentAction} from '../prototype/model.ts'
export {money,demoKey} from '../prototype/model.ts'
export type {Outcome} from '../prototype/model.ts'
export type State=PaymentState & {accounts:string[]}
export type Action=PaymentAction | {type:'REGISTER_ACCOUNT';bank:string;at?:string}
export function initialState(prepared=false):State{return {...paymentInitialState('direct','WIRE-001'),connected:prepared,accounts:prepared?['Example Bank A']:[]}}
export function reducer(s:State,a:Action):State{
 if(a.type==='REGISTER_ACCOUNT')return {...s,accounts:[...new Set([...s.accounts,a.bank])],connected:s.connected||s.bank===a.bank}
 if(a.type==='RESET')return initialState(a.value==='prepared')
 if(a.type==='START'&&s.stage==='idle')return {...s,stage:'entry'}
 if(a.type==='REVIEW'&&s.stage==='entry')return s.recipient&&amountCents(s.amount)?{...s,stage:'connect',approved:false,error:''}:{...s,error:'Find the recipient and enter a valid amount.'}
 if(a.type==='BANK'&&s.stage==='connect')return {...s,bank:a.bank??s.bank,connected:s.accounts.includes(a.bank??s.bank),approved:false}
 if(a.type==='CONNECT'&&s.stage==='connect')return {...s,stage:s.connected?'review':'bank-connect',error:''}
 if(a.type==='CONNECTED'&&s.stage==='bank-connect')return {...s,stage:'review',connected:true,accounts:[...new Set([...s.accounts,s.bank])],error:''}
 if(a.type==='EDIT'&&s.stage==='connect')return {...s,stage:'entry',error:''}
 if(a.type==='EDIT'&&s.stage==='review'&&a.value==='source')return {...s,stage:'connect',approved:false,error:''}
 if(a.type==='RETRY'&&s.stage==='failed')return {...s,stage:'review',approved:false,error:'',notice:''}
 return {...paymentReducer(s,a),accounts:s.accounts}
}
