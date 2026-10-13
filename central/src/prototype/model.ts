export type MoneyPath = 'direct' | 'topup'
export type Stage = 'idle' | 'connect' | 'bank-connect' | 'entry' | 'review' | 'approval' | 'authorize' | 'bank' | 'processing' | 'funded' | 'failed' | 'unknown' | 'paid'
export type Outcome = 'success' | 'failed' | 'unknown'
export type Event = {id:string;title:string;actor:string;dateTime:string;description?:string}
export type State = {path:MoneyPath;stage:Stage;bank:string;connected:boolean;key:string;amount:string;recipient:string;approved:boolean;funded:boolean;leg:'funding'|'supplier';attempt:number;intent:string;notice:string;error:string;events:Event[]}
export type Action = {type:'START'|'BANK'|'CONNECT'|'CONNECTED'|'CANCEL_CONNECTION'|'FIELD'|'LOOKUP'|'REVIEW'|'EDIT'|'REQUEST'|'APPROVE'|'AUTHORIZE'|'CANCEL_AUTH'|'SEND'|'RESULT'|'RETRY'|'PAY_FUNDED'|'CHECK'|'RESET';path?:MoneyPath;bank?:string;field?:'key'|'amount';value?:string;outcome?:Outcome;attempt?:number;at?:string}
export const demoKey='payments@example-supplier.test'
export function initialState(path:MoneyPath='direct',intent='DEMO-001'):State{return {path,stage:'idle',bank:'Example Bank A',connected:false,key:demoKey,amount:'1750.00',recipient:'',approved:false,funded:false,leg:path==='topup'?'funding':'supplier',attempt:0,intent,notice:'',error:'',events:[]}}
export function amountCents(value:string){if(!/^\d+(?:\.\d{1,2})?$/.test(value))return 0;const n=Math.round(Number(value)*100);return Number.isSafeInteger(n)&&n>0&&n<=100000000?n:0}
export function money(value:string){return new Intl.NumberFormat('en-US',{style:'currency',currency:'BRL'}).format(amountCents(value)/100)}
function record(s:State,a:Action,title:string,actor:string,patch:Partial<State>,description?:string):State{return {...s,...patch,error:'',events:[...s.events,{id:`event-${s.events.length+1}`,title,actor,dateTime:a.at??'2026-10-13T12:00:00Z',description}]}}
export function reducer(s:State,a:Action):State{
 switch(a.type){
 case 'RESET':return initialState(a.path??s.path,a.value??'DEMO-001')
 case 'START':if(s.stage!=='idle')return s;return {...s,stage:s.connected?'entry':'connect',path:a.path??s.path,leg:(a.path??s.path)==='topup'?'funding':'supplier',error:''}
 case 'BANK':return s.stage==='connect'?{...s,bank:a.bank??s.bank}:s
 case 'CONNECT':return s.stage==='connect'?{...s,stage:'bank-connect',error:''}:s
 case 'CANCEL_CONNECTION':return s.stage==='bank-connect'?{...s,stage:'connect',error:'Account connection was not completed. You can try again.'}:s
 case 'CONNECTED':return s.stage==='bank-connect'?record(s,a,'Account connected','Bank-authorized representative',{stage:'entry',connected:true},'Payment-specific authorization is still required.'):s
 case 'FIELD':if(s.stage!=='entry'||!a.field)return s;return {...s,[a.field]:a.value??'',recipient:a.field==='key'?'':s.recipient,approved:false,error:''}
 case 'LOOKUP':if(s.stage!=='entry')return s;return s.key===demoKey?{...s,recipient:'Example Supplier Ltd.',error:''}:{...s,recipient:'',error:'Use the example Pix key shown below to test beneficiary validation.'}
 case 'REVIEW':if(s.stage!=='entry')return s;return s.connected&&s.recipient&&amountCents(s.amount)?{...s,stage:'review',error:''}:{...s,error:'Confirm the beneficiary and enter a valid BRL amount before reviewing.'}
 case 'EDIT':if(!['review','approval','authorize','failed'].includes(s.stage)||s.funded)return s;return {...s,stage:'entry',approved:false,error:''}
 case 'REQUEST':return s.stage==='review'?record(s,a,'Payment request submitted','Nágela · requester',{stage:'approval'},'Company approval pending; no money has moved.'):s
 case 'APPROVE':return s.stage==='approval'?record(s,a,'Company approval recorded','Carlos · company approver',{stage:'authorize',approved:true},'Bank authorization is the next step; no money has moved.'):s
 case 'AUTHORIZE':return s.stage==='authorize'&&s.approved?{...s,stage:'bank',notice:'',error:''}:s
 case 'CANCEL_AUTH':return s.stage==='bank'?record(s,a,'Bank authorization interrupted','Bank-authorized representative',{stage:'authorize',notice:'Bank authorization was canceled. Your details and company approval are saved; no payment was submitted.'},'Draft and company approval retained; no payment was submitted.'):s
 case 'SEND':return s.stage==='bank'&&s.approved?record(s,a,s.leg==='funding'?'Top-up authorized':'Supplier Pix authorized','Bank-authorized representative',{stage:'processing',attempt:s.attempt+1},s.path==='topup'?'External account → Clara account.':'External account → supplier.'):s
 case 'RESULT':case 'CHECK':{
  if(!a.outcome)return s
  if(a.type==='RESULT'&&(s.stage!=='processing'||a.attempt!==s.attempt))return s
  if(a.type==='CHECK'&&(s.stage!=='unknown'||(a.value&&a.value!==s.intent)))return s
  if(a.outcome==='unknown')return record(s,a,'Outcome awaiting confirmation','Payment service',{stage:'unknown'},'Same intent remains open. Do not submit again.')
  if(a.outcome==='failed')return record(s,a,s.funded?'Supplier payment failed — temporary execution error':'Payment failed — insufficient funds','Payment service',{stage:'failed'},s.leg==='funding'?'No top-up was completed.':'No supplier payment was completed.')
  return s.leg==='funding'?record(s,a,'Top-up confirmed','Payment service',{stage:'funded',funded:true},'Funds arrived in Clara. Supplier has not been paid.'):record(s,a,'Supplier payment confirmed','Payment service',{stage:'paid'},'Final result received for the same payment intent.')
 }
 case 'PAY_FUNDED':return s.stage==='funded'&&s.funded&&s.approved?record(s,a,'Supplier payment released','Clara payment service',{stage:'processing',leg:'supplier',attempt:s.attempt+1},'Clara account → supplier. Separate from the completed top-up.'):s
 case 'RETRY':return s.stage==='failed'?{...s,stage:s.funded?'funded':'authorize',error:''}:s
 default:return s
 }
}
