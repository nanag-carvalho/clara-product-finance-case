export type Evidence = 'Demo' | "Official" | "Reconstruction"
export type Screen = { id: string; title: string; area: string; file: string; kind: Evidence; note: string; source?: string }
const help = 'https://ajuda.clara.com/hc/pt-br/articles/'
export const screens: Screen[] = [
  {id:'resumo',title:"Account overview",area:"Financial overview",file:'assets/01-resumo.png',kind:'Demo',note:"Credit, transaction balance, flexible limit and activity."},
  {id:'transacoes',title:"Card transactions",area:"Expense management",file:'assets/02-transacoes.png',kind:'Demo',note:"Cardholders, cards, receipts and expense review."},
  {id:'tarefas',title:"Task queue",area:"Approvals",file:'assets/03-tarefas.png',kind:'Demo',note:"Requests and approval actions. The detail view was not captured."},
  {id:'conta',title:"Digital Account",area:"Financial overview",file:'assets/04-conta-digital.png',kind:'Demo',note:"Balances, financial actions and the Clara account statement."},
  {id:'pix',title:"Pix area",area:"Payments",file:'assets/05-area-pix.png',kind:'Demo',note:"Keys, transfers, payment requests and limits."},
  {id:'pagamentos',title:"Payments overview",area:"Payments",file:'assets/06-pagamentos.png',kind:'Demo',note:"Entry point: creation, approval, scheduling and status."},
  {id:'processando',title:"Processing in the list",area:"Execution",file:'assets/18-demo-processamento.png',kind:'Demo',note:"Boleto processing at step 14; this does not establish Pix execution behavior.",source:'https://app.supademo.com/demo/cmm97tev664tqdtfhc3gb0vt5?step=14'},
  {id:'formulario',title:"New payment",area:"Creation",file:'assets/08-formulario-pagamento.png',kind:"Official",note:"Form with documents, payment details and review.",source:help+'42531424668307'},
  {id:'gif',title:"Payment entry",area:"Creation",file:'assets/09-demonstracao-pagamento.gif',kind:"Official",note:"Animated demonstration of methods, identifiers and validation.",source:help+'42531424668307'},
  {id:'erro-chave',title:"Invalid Pix key",area:"Validation",file:'assets/09-frame-118.png',kind:"Official",note:"Frame from the official GIF. Inline field error and disabled Review action.",source:help+'42531424668307'},
  {id:'codigo',title:"Code confirmation",area:"Authentication",file:'assets/16-confirmacao-codigo.png',kind:"Official",note:"Email code in Clara. This is not external bank consent.",source:help+'27623979963027'},
  {id:'recibo',title:"Pix transaction receipt",area:"Traceability",file:'assets/15-detalhe-transacao.png',kind:"Official",note:"Source, destination, ID and download. The final PDF was not obtained.",source:help+'46019394818195'},
  {id:'condicoes',title:"Approval conditions",area:"Approvals",file:'assets/12-condicoes-fluxo.png',kind:"Official",note:"Conditions for configuring rules, rather than approving a request.",source:help+'41962086294291'},
  {id:'camadas',title:"Approval layers",area:"Approvals",file:'assets/13-camadas-aprovacao.png',kind:"Official",note:"Configuration of approvers and automatic actions.",source:help+'41962086294291'},
  ...[
    ['01-beneficiario-validado',"Validated beneficiary","Creation"],['02-revisao',"Review before submission","Review"],['03-solicitacao',"Request recorded","Request"],['04-aprovacao',"Approval detail","Approvals"],['05-processamento',"Processing detail","Execution"],['06-falha',"Failure detail","Execution"],['07-auditoria',"Decision history","Traceability"],
  ].map(([id,title,area]) => ({id,title,area,file:`reconstrucoes/${id}.svg`,kind:"Reconstruction" as const,note:"Low-fidelity diagram. Layout, data and behavior require validation."})),
]
