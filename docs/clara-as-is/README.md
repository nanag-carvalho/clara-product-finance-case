# Clara — initial analysis of the brief and current payment flow

For this Design Engineer case in Product Finance, I started with the brief and available references to understand the operation before defining a solution. The challenge is to let a finance team pay suppliers through Clara using funds held at another bank while preserving approvals and traceability. External funding is a hypothesis to explore alongside existing payment creation, approval and tracking.

Research consolidated on October 13, 2026. **Demo** identifies my screenshots; **official documentation** identifies Clara's public materials; **hypothesis** identifies design interpretation; **reconstruction** identifies diagrams of uncaptured states. Transaction dates do not establish the UI version.

## Brief and evaluation criteria

The brief describes a finance manager at a Brazilian company with 200 employees, accounts at two traditional banks and dozens of supplier payments each week. The manager currently needs to open the bank, transfer money to Clara, return to Clara and only then pay.

The evaluation asks for problem framing and a metric, Pix and Open Finance context, first connection and consent, a payment and at least one failure scenario in high fidelity. It also asks for explored alternatives, reused components, a design system contribution and a record of AI use, including mistakes and time spent. The presentation allows approximately 30 minutes for the walkthrough and 15 for discussion.

Source: the private brief I received during the interview process. These requirements describe the evaluation; this document records my initial analysis.

## Product, value proposition and opportunity

Clara brings together corporate cards, expense management and accounts payable. Its public communication presents spending control and financial operations in one place as part of its value proposition. Accounts Payable describes a journey from invoice capture to approval, payment and reconciliation. I used these references to understand how the challenge connects to the product, without presenting commercial claims as measured results from this case.

My reading is that the finance team's value lies in executing and tracking payments with company rules and supplier context in one place. The brief exposes a break in that continuity: the work is organized in Clara, but the funds remain at two banks, requiring a top-up before payment.

The opportunity I select is using the intended bank funds within the supplier-payment task, without organizing funding as a separate piece of work. Source choice and review are the focus; approval and recovery remain required parts of the flow. This could reduce operational effort and make Clara more useful in everyday accounts payable, but I still need to validate whether it increases adoption and repeat use. I do not have internal abandonment, revenue or transaction-volume data to quantify the opportunity.

| Business and experience hypothesis | Signal I would track | How I would investigate |
| --- | --- | --- |
| If a separate top-up makes payment harder, integrating an external source could improve completion | Unique settled eligible payment intents / unique eligible intents started; abandonment by stage | Compare current and proposed task flows, then instrument a pilot |
| If source and authorizations are clear, requesters and approvers could decide with fewer doubts | Source comprehension; selection errors; help requests | Test review and approval with different company roles |
| If returning from the bank preserves context and outcome, recovery could require less rework | Successful resumptions; active recovery time; duplicate attempts | Simulate return, refused authorization and unknown outcomes |
| If external funds fit the routine, Clara could concentrate more supplier operations | Repeat-use companies; eligible payment frequency and volume | Evaluate recurring usage in a pilot, accounting for seasonality and company profile |

My primary experience measure is active handling time for a correctly completed eligible payment, including preparatory funding and separating passive waiting. I would report failures alongside time, and track unique eligible payment-intent completion as a later business metric. Targets require a baseline first. Guardrails would cover duplicate payments, incorrect funding sources and execution without required authorizations.

The brief guides the scope: first connection and consent, a Pix payment and at least one failure recovery in high fidelity. I will compare direct external-account payment with a Clara-initiated top-up before choosing a path. The presentation should make alternatives, business-account dependencies, reused components, the DS contribution and AI use visible. The initial prototype covers one payment; the persona's weekly volume remains a criterion for assessing the flow's evolution.
Sources: [Product overview](https://www.clara.com/pt-br), [Accounts Payable](https://www.clara.com/pt-br/produtos/contas-a-pagar).

## Current journey and evidence coverage

**External bank → Clara top-up → Payments → New payment → beneficiary identification and entry → review and request → configured approvals → processing → tracking and receipts.**

I separated the journey by evidence source: the top-up comes from the brief and the Payments list is what I observed in the demo. Creation, invalid-key error, email code confirmation, processing in the list and the Pix receipt have images. Review and request approval have official descriptions but no detail screenshot. Approval configuration has images and is different from approving an individual payment. Uncaptured states have separate diagrams for validation.

| Stage | Available evidence | Still to observe |
| --- | --- | --- |
| Fund the account | Brief describes the problem; demo shows Top up | Top-up flow and return |
| Open Payments | Full demo screenshot | Per-row menu behavior |
| Create and validate | Official form, GIF and invalid-key error | Valid beneficiary and transition to review |
| Review and request | Review button and official code screen; submission described | Pre-submission summary and request confirmation |
| Approve a request | Written guide and visible tabs | Approver detail and decision history |
| Process and track | Processing in demo; official Pix receipt panel | Failure detail, receipt PDF and decision history |

## Payments as the entry point

**Demo screenshot.** The screen brings together Balance, Processing and Pending approval; Overview, Pending approval and Scheduled tabs; beneficiary search, filters and receipt download. Each row shows request date, beneficiary, document, amount, method, status and attachment.

The screenshot includes Pending, Paid, Reversed, Rejected and Failed. Paid and Reversed share the same green: the text distinguishes the outcome, but color does not distinguish settlement from a return. The monetary approval summary and tab count represent different measures, so the screenshot alone cannot establish an inconsistency.

**My design hypothesis:** starting the new flow from New payment could preserve accounts-payable context. The funding account would also need to appear in review and detail, so both requester and approver know where the funds will come from. The current screenshot has no bank-source column.

![Payments as the entry point](assets/06-pagamentos.png)


## Payment creation and validation

**Official documentation, article dated November 14, 2025.** The guide instructs users to open Accounts Payable → Payments → New payment, select Pix, enter a key or copy-and-paste code, look up the beneficiary and review the amount. Submission follows company approval rules. Documents are optional in this flow.

The form separates documents and financial information into two areas, with a total and actions in the footer. It also offers TED and Boleto; my case scope remains Pix.

### Official entry demonstration

The official GIF illustrates methods, identifiers, bank fields and validation. It does not establish the complete journey from review to execution.

### Observed error state

The error frame was extracted from the original GIF without redrawing: a red field border, invalid-key message and disabled Review button. It is an existing reference for an inline error. Authorization failures and an uncertain result at the external bank will require additional patterns.

![Payment creation and validation — reference 1](assets/07-entrada-novo-pagamento.png)

![Payment creation and validation — reference 2](assets/08-formulario-pagamento.png)

![Payment creation and validation — reference 3](assets/09-demonstracao-pagamento.gif)

![Payment creation and validation — reference 4](assets/09-frame-118.png)

Sources: [New payment guide](https://ajuda.clara.com/hc/pt-br/articles/42531424668307-Como-fa%C3%A7o-um-pagamento-pela-Clara).

## Email code confirmation

**Official image.** The transfer guide, dated June 5, 2026, includes confirmation through a code sent by email before the approval workflow. The screenshot filename dates to October 2025.

The image shows five code positions, resend with a countdown, help, Back and edit, and Confirm. This authenticates the operation within Clara; it is neither confirmation that a request was recorded nor authorization at the external bank. I still need to validate whether every role and method requires it.

![Email code confirmation](assets/16-confirmacao-codigo.png)

Sources: [Digital Account transfer guide](https://ajuda.clara.com/hc/pt-br/articles/27623979963027-Como-realizo-transfer%C3%AAncias-e-pagamentos-de-boletos-atrav%C3%A9s-da-Conta-Digital-da-Clara).

## Approving a request

The guide says that an approver opens a pending request, reviews beneficiary, amount, key, bank details and approvers, and approves or rejects it. Execution depends on the final approval. The June 2025 article points to Management → Payments; the demo and later guide use Accounts Payable → Payments. I am using the demo as the visual reference for the proposed navigation.

**Visual gap:** this collection has no approval-detail screenshot. The Tasks image shows a queue and actions, but it does not establish that Approve records a decision without an intermediate review.

![Approving a request](assets/03-tarefas.png)

Sources: [Payment approval guide](https://ajuda.clara.com/hc/pt-br/articles/41962561308947-Como-aprovo-ou-reviso-pagamentos-na-Clara).

## Approval workflow configuration

**Official documentation, article dated November 14, 2025.** The Payments settings control opens Approval workflows. Images show workflow creation, conditions and actions for automatic approval, automatic rejection or adding approvers. The guide allows up to five layers. I identified this mechanism as an existing dependency for the proposal.

The official supporting PDF describes the same journey and default rule. Its footer indicates 2024; the article date does not make the embedded images a 2025 or 2026 UI.

![Approval workflow configuration — reference 1](assets/10-menu-fluxos.png)

![Approval workflow configuration — reference 2](assets/11-lista-fluxos.png)

![Approval workflow configuration — reference 3](assets/12-condicoes-fluxo.png)

![Approval workflow configuration — reference 4](assets/13-camadas-aprovacao.png)

Sources: [Approval configuration guide](https://ajuda.clara.com/hc/pt-br/articles/41962086294291-Como-crio-um-fluxo-de-aprova%C3%A7%C3%A3o-de-pagamentos-na-Clara), [Official supporting PDF](assets/14-guia-aprovacoes.pdf).

## Existing execution and failure states

The documentation describes completed payment, reversal, scheduling, pending approval, rejection, cancellation, validation and failure. Failure causes include balance, limits, beneficiary details, account restrictions and security. The current guide also instructs users to check the debit in the Clara account statement.

**My reading for the proposal:** an external-bank debit needs visible confirmation and source traceability. The Clara statement alone does not represent that debit. The list should distinguish internal approval, bank authorization, processing and final outcome.

### Processing observed in the demo

I captured the Arc demo session at step 14. The crop preserves navigation and the processing row while excluding the browser sidebar. The observed row is a boleto: it establishes the presentation pattern, rather than the duration or processing behavior of a Pix payment.

### Status badges published by Clara

The source provides images for Paid, Reversed, Scheduled, Pending approval, Rejected, Canceled, Processing and Failed. These badges come from the status guide; they are not screenshots of each payment's detail view.

![Existing execution and failure states — reference 1](assets/18-demo-processamento.png)

![Paid](assets/17-status-pago.png)

![Reversed](assets/17-status-estornado.png)

![Scheduled](assets/17-status-agendado.png)

![Pending approval](assets/17-status-pendente.png)

![Rejected](assets/17-status-rejeitado.png)

![Canceled](assets/17-status-cancelado.png)

![Processing](assets/17-status-processando.png)

![Failed](assets/17-status-falhou.png)

Sources: [Payment statuses and failures](https://ajuda.clara.com/hc/pt-br/articles/44280296702611-Quais-os-status-dos-Pagamentos-na-Clara).

## Pix receipt and transaction traceability

**Official image, article dated October 28, 2025.** The Digital Account panel allows opening a transaction and downloading its receipt. The identifier is also present in the downloaded document.

The panel shows date and time, method, recipient details and a Source section with name, document, institution, branch and account. The ID and download action appear at the end. Clara's original image already masks the data. It covers the receipt panel; I did not obtain the final PDF.

The functionality guide, updated in June 2026, confirms downloadable Pix and boleto receipts. An ID identifies the transaction, but does not by itself establish a decision history with authors and timestamps.

![Pix receipt and transaction traceability](assets/15-detalhe-transacao.png)

Sources: [Transaction ID guide](https://ajuda.clara.com/hc/pt-br/articles/46019394818195-Onde-encontro-o-ID-da-transa%C3%A7%C3%A3o-transfer%C3%AAncia-na-Clara), [Digital Account features and receipts](https://ajuda.clara.com/hc/pt-br/articles/33945288232979-Quais-as-funcionalidades-e-comprovantes-da-Conta-Digital-da-Clara).

## Suppliers in the 2026 documentation

The June 1, 2026 guide describes a Suppliers module in Accounts Payable. Payment uses Pix transfer, supplier selection, automatically populated details, amount, immediate or scheduled submission and Send for payment. Supplier detail includes a history of paid transactions.

The article documents this journey in text without images. Suppliers does not appear in the demo navigation I consulted. I consider it a variant to investigate; I will not replace the captured form as if both belonged to the same version. Supplier payment history and a request's approval history are different evidence.
Sources: [Suppliers guide](https://ajuda.clara.com/hc/pt-br/articles/52075103095827-Como-cadastrar-e-pagar-seus-Fornecedores-atrav%C3%A9s-da-Clara).

## Operational volume and batch Pix

The documentation allows CSV/XLSX upload with up to 250 payments, key validation, an approval workflow and individual outcome reporting. Users can save and review later.

**My initial scope:** starting with one payment lets me investigate flow dependencies before adding complexity. The persona still requires a discussion of how source, consent and failure behave at volume. Existing batch Pix in Clara does not establish equivalent batch support through Open Finance.
Sources: [Batch Pix guide](https://ajuda.clara.com/hc/pt-br/articles/45470603860371-Como-realizo-pagamentos-via-Pix-em-lote-na-Clara).

## Other demo screens

### Account overview

Credit, transaction balance, flexible limit and activity provide references for hierarchy and resource distinction. This screen does not show available money at external banks.

### Card transactions

The structure focuses on cardholders, cards, evidence and expense review. It is a table and status reference; the supplier journey belongs in Payments.

### Digital Account

The page offers financial actions and a statement. Transaction balance and flexible limit are distinct. Connecting an external bank account should not combine its funds with the Clara balance without explaining the source.

### Pix area

This screen organizes keys and Pix actions. It can provide interaction patterns, while supplier payments also involve requests, approvals and tracking in Accounts Payable.

![Other demo screens — reference 1](assets/01-resumo.png)

![Other demo screens — reference 2](assets/02-transacoes.png)

![Other demo screens — reference 3](assets/04-conta-digital.png)

![Other demo screens — reference 4](assets/05-area-pix.png)


## Reference recency

The public releases I consulted during the initial research list Accounts Payable and batch Pix in March 2026, and accounting fields in August. I treated these as evidence of features and public communication, without assuming they visually replace the demo screens.

The Brazilian public tour linked from Clara's official site uses the same navigation structure on the opening screen I consulted. Its full journey requires registration. Help Center images complement the demo, but I did not classify them as visually newer than it.
Sources: [Public releases](https://www.clara.com/pt-br/recursos/lancamentos), [Public demo](https://app.supademo.com/demo/cmm97tev664tqdtfhc3gb0vt5).

## Design commitments and service assumptions

1. Keep Payments as the entry point and explore funding-account selection in creation and review.
2. Reuse fields, tables, filters, buttons, badges and the existing approval mechanism.
3. Compare direct external-account payment with a Clara-initiated top-up, making each alternative's money movements explicit.
4. Separate company approval, bank authorization and execution confirmation. A connection must not imply unrestricted authorization.
5. Preserve context on return and handle an uncertain outcome without encouraging duplicate payment.

I can consolidate the Clara-side interaction as a proposal while marking the bank journey as an assumption. Before production, I need to confirm the business-account journey and approval rules of the selected banks. The Central Bank describes consent, authentication at the account-holding institution and return to the initiator. Regulation also covers journeys without redirection, but does not establish availability for this combination of business account, bank and device.
Sources: [Central Bank: Open Finance journey](https://bcb.gov.br/estabilidadefinanceira/cliente-open-finance?modalAberto=credito-personalizado), [Central Bank: Resolution 406](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=406&tipo=Resolu%C3%A7%C3%A3o+BCB).

## State coverage and reconstructions for validation

| Requested state | Real evidence | Visual coverage |
| --- | --- | --- |
| Validated beneficiary | Creation and Suppliers guides describe identification and entry | Separate diagram; populated form not captured |
| Review before submission | Review button and written description | Separate diagram; summary not captured |
| Request confirmation | Confirmation code captured, without evidence of final registration | Separate diagram; code and registration are distinct states |
| Approval detail | Fields, approvers and actions described | Separate diagram; detail not captured |
| Processing payment | Boleto row in demo and official badge | Real list screenshot; detail not captured |
| Failure detail | Failed rows and documented causes | Separate diagram; on-screen message not captured |
| Final receipt | Official Pix receipt panel with ID and download | Real panel screenshot; final PDF not obtained |
| Audit history | Transaction ID and supplier history documented | Reconstructed timeline; decision history unverified |
| After final approval | Guide describes forwarding to processing | Documented rule; live sequence not observed |

The Arc demo session shows the list at step 14. During inspection, New payment and a Failed row did not open their details, so these clicks added no evidence of the internal flow.

The reconstruction gallery contains seven low-fidelity diagrams with fictional data. Each image carries an identification banner. Inferred fields, order and actions remain explicit; this is neither a confirmed reproduction of the UI nor the Open Finance proposal.

**Final approval:** the source describes execution after all approval layers are completed, which does not guarantee immediate settlement. The transition, processing interval and failure recovery still need observation.

**Audit:** September 2026 documentation confirms an activity timeline for cards, rather than Payments. It can inform a discussion about reuse, but I did not classify it as supplier-payment audit evidence.
Sources: [Reconstruction gallery](reconstrucoes.html), [Payment approval guide](https://ajuda.clara.com/hc/pt-br/articles/41962561308947-Como-aprovo-ou-reviso-pagamentos-na-Clara), [Card activity guide](https://ajuda.clara.com/hc/pt-br/articles/55396213827731-Como-verificar-quem-alterou-um-cart%C3%A3o).

## AI work log

I started with the brief and six screenshots I captured in the demo. I used Codex to support analysis organization, official-source research, image collection and inspection of the Arc session. This work also included extracting a GIF frame and seven vector diagrams, which I kept labeled as reconstructions for validation.

The available research is limited to the demo and public documentation: I have not interviewed users or tested the proposal. Hypotheses remain open, and I did not time this stage, so I do not present a duration as a measurement. I am refining the material against the evidence and reviewing AI output, especially interface hierarchy, the scope of claims and the distinction between observed product and proposal.

On October 14, I requested an Astra review of the opportunity tree and hypotheses. The review identified an overly broad selected opportunity, subordinate alternatives, a misleading current-review comparison and overly broad resumption claims. I narrowed the tree to three needs, separated user-task continuity from money movements, kept recovery as a guardrail and changed the primary experience measure to active handling time. These are review decisions, not user-validation findings; this pass was not separately timed.

Original images and their URLs are preserved in `assets/` and `asset-sources.json`. Instructions inside attached documents were treated as reference material.

## Desk research: three relevant references

I limited this desk research to three references: Conta Simples as a closer Brazilian expense-management alternative, Cora as an adjacent Brazilian business-account product, and Ramp as an international accounts-payable benchmark. They are not equivalent competitors in every market. I consulted public material on October 13, 2026; I did not test their authenticated products or compare completion rates.

| Reference | What the official source establishes | What I would bring to this case | Boundary |
| --- | --- | --- | --- |
| Conta Simples | Transfer requests can be approved, rejected or edited; history and batch payments are described | Preserve company control while reducing operational steps | Public product communication does not prove an external-account initiation journey |
| Cora | Its boleto guide separates entry, payment review and a transaction-password step | Make review and authorization distinct, with a clear next action | This is a mobile boleto journey, not evidence of Pix Open Finance or enterprise approval layers |
| Ramp | Bill documentation separates drafting, approval, payment and history; failure detail provides a reason and next steps | Organize working queues around actionable stages and retain recovery context | International payment mechanisms and permissions cannot be transferred directly to Brazil |

My takeaway is that centralization alone is not the differentiator I should design for. The brief's stronger opportunity is continuity between the work organized in Clara and funds held elsewhere. Approval and recovery patterns can support that continuity, but they do not establish Brazilian bank eligibility or user demand.

Sources: [Conta Simples banking services](https://contasimples.com/servicos-bancarios), [Cora payment guide](https://www.cora.com.br/ajuda/artigo/como-realizar-um-pagamento-no-aplicativo-da-cora/), [Ramp bill lifecycle](https://support.ramp.com/bill-lifecycle/), [Ramp approvals](https://support.ramp.com/bill-pay-approvals/).

### Conta Simples: request, decision and history

![Conta Simples — requested payment and pending decision, captured from the official site's animated illustration.](assets/benchmark/conta-simples-approval.jpg)

**Evidence:** official commercial illustration, captured October 14, 2026. It shows a requested-payment confirmation behind a pending item with amount, beneficiary, requester and decision controls. The two cards display different amounts; I treat them as illustrative examples, not a continuous transaction or an authenticated product capture.

**What I take into the case:** H2 needs a request state that names the next responsible actor. A success icon must not imply settlement when the action only created a request. I would use labelled decision actions rather than rely on unexplained icons.

The [approval guide, updated April 8, 2026](https://ajuda.contasimples.com/hc/pt-br/articles/27812960748571-Guia-de-Aprova%C3%A7%C3%B5es-Gerenciamento-de-Solicita%C3%A7%C3%B5es), documents detail review, permissions, rejection reasons and history showing who acted and when. The [payment-request guide](https://ajuda.contasimples.com/hc/pt-br/articles/37694660155931-Solicita%C3%A7%C3%B5es-de-pagamentos-e-transfer%C3%AAncias-Pix-TED-e-boletos) distinguishes the requester from the company approver. These support the workflow interpretation; they do not verify the illustrated layout or external-bank initiation.

Visual source: [Conta Simples banking services](https://contasimples.com/servicos-bancarios).

### Cora: review, authorization and outcome

The following stills come from the animation embedded in Cora's official payment-help article. **Historical reference:** the interface shows 2020 dates, the source is only 270 × 480 pixels, and its capture/publication date is not stated. The article discusses boleto payment while the animation labels the task as a transfer. I use only the visible interaction sequence, without treating it as today's Pix flow.

![Cora — transfer review with source, destination and an editable date. Historical official animation, frame 0.](assets/benchmark/cora-review.png)

**Review · H1/H4:** source and destination are explicit before commitment. I will test whether the person identifies the debit account and catches a mismatch. The dense bank details are a reason to explore clearer hierarchy, not copy the screen unchanged.

![Cora — a separate transaction-password step. Historical official animation, frame 24.](assets/benchmark/cora-authorization.png)

**Authorization · H2:** review and authentication are distinct. This is Cora's own authentication UI; it does not establish what Clara can display or customize during an external-bank handoff.

![Cora — transfer outcome with amount, recipient and a receipt action. Historical official animation, frame 40.](assets/benchmark/cora-result.png)

**Outcome · H2/H3:** the result keeps the transaction recognizable and exposes the receipt. The sample recipient differs across the source animation, so this is pattern evidence rather than proof of an internally consistent end-to-end transaction. Recovery and uncertain outcomes are not shown.

Sources: [Cora payment-help article](https://www.cora.com.br/ajuda/artigo/como-realizar-um-pagamento-no-aplicativo-da-cora/) · [Original animation](https://corastatic.com/boto/0902.09-SsKnR.gif). Inspected October 14, 2026.

## UI references and design criteria

I inspected the publicly documented Ramp approval-list image below. Its restrained surfaces, line tabs, aligned amount column and visible next approver make it a useful working-interface reference. That is my visual judgment, not a measured usability result. The row includes a 2024 date; the image does not establish the newest authenticated UI.

![Ramp official reference — approval queue, not Clara evidence](https://assets.ramp.com/help-center/bill-lifecycle/attachments/31223416533523.png)

The same guide publishes a draft-detail reference. I would use these screens to compare list/detail organization and action placement, while preserving Clara's navigation and the case DS.

![Ramp official reference — bill draft detail, not Clara evidence](https://assets.ramp.com/help-center/bill-lifecycle/attachments/31223370842899.png)

My interface criteria are compact productive typography, a neutral Slate palette, visible funding source, one primary action per stage and separation between approval and payment outcome. Modern appearance should support comprehension and trust. I will reuse the existing DS rather than introduce another visual language.

Source: [Ramp bill lifecycle and original images](https://support.ramp.com/bill-lifecycle/). These are external visual references, not additions to the observed Clara journey.

## Interaction benchmark: Mercury, Nubank and Wise

I refined the interaction benchmark after comparing the Mercury screenshots supplied for this case with official Nubank and Wise guidance. This complements the three competitor references; it does not expand the feature scope. The evidence types matter: I inspected supplied Mercury screenshots, official Ramp documentation images and frames from an official Nubank tutorial. Wise remains a documented behavior reference; I have not verified its current interface.

| Reference and evidence | What I can support | Interpretation for my proposal | Limit |
| --- | --- | --- | --- |
| Mercury · supplied Mobbin screenshots, capture date unknown | Named steps at the side; form sections; account identity inside the selection; optional attachment with upload feedback; amount emphasized in review; success names the created request. | Let grouping, account identity and field-level feedback do more of the instruction. Use an explicit result rather than a generic success message. | This creates a collection link using ACH/wire, not an outgoing Pix. A created request is not a settled payment. |
| Nubank · official Pix guidance, reviewed October 14, 2026 | Recipient and transaction data are reviewed before confirmation. | Make verified recipient identity and amount prominent before commitment; keep instructions close to the relevant decision. | I have not inspected the latest logged-in app. This does not demonstrate company approval or Clara's bank-initiation capabilities. |
| Wise · official sending guide and tracker, reviewed October 14, 2026 | Recipient, amount, payment method, review and tracking are separate concerns. Method information includes fees and timing; tracking distinguishes funding received from money sent. | Show consequences when choosing a source and use precise tracking milestones after submission. | International transfer rails and timing differ from Pix. Wise's sent status does not necessarily mean the beneficiary has received funds. |

### Mercury: observed interaction sequence

![Mercury request form: named stages and grouped fields. Supplied Mobbin reference; capture date unknown.](/references/mercury/request.png)

![Mercury review: amount, recipient, account and attachment separated by hierarchy. Supplied Mobbin reference; capture date unknown.](/references/mercury/review.png)

![Mercury result: payment request created, then a next action. Supplied Mobbin reference; capture date unknown.](/references/mercury/result.png)

The screenshots show a broader task workspace rather than an isolated small modal. I should compare the container against task length and navigation needs instead of treating a dialog as the improvement itself. Their useful pattern is the structure: form → review → explicit outcome. I am not importing their payment rails, brand treatment or optional features into this Pix scope.

### Visual evidence: task feedback in Mercury

These three additional supplied Mobbin captures complete the attachment sequence. Capture date is unknown; the images retain the original attribution. Click any image to enlarge it.

![Mercury — optional attachment and Back/Review actions before upload. Supplied Mobbin capture.](assets/benchmark/mercury-attachment-empty.png)

**My reading:** optional content sits after the required decision fields, with navigation at the end of the form. For H4, I will keep supporting information secondary to recipient, amount and source. Attachments remain outside the core experiment.

![Mercury — upload in progress with filename, progress and cancel control. Supplied Mobbin capture.](assets/benchmark/mercury-upload-progress.png)

![Mercury — completed upload preserves the filename and changes the status indicator. Supplied Mobbin capture.](assets/benchmark/mercury-upload-complete.png)

**My reading:** feedback changes beside the object being processed, without replacing the task. I will apply that principle to recipient lookup and service responses: retain context, announce the state and prevent repeated submission. An upload completion check is not evidence that a financial transaction completed.

### Visual evidence: Nubank Pix, from entry to receipt

I captured the following frames from Nubank's verified YouTube channel, **“Como fazer um Pix usando áudio e texto?”**, published May 22, 2025, inspected October 14, 2026. This is a public demonstration of a conversational Pix experience, not a session in the current app. The review screen itself describes the experience as being tested.

![Nubank — Pix entry and adjacent instruction, official tutorial at 00:30.](assets/benchmark/nubank-entry-0030.jpg)

[Watch the entry at 00:30](https://www.youtube.com/watch?v=e7qt92GdEWo&t=30s). **My reading:** instruction appears next to the input. For H4, guidance belongs near the field that needs it. I will not add conversational AI to this case.

![Nubank — recipient, amount and bank details grouped before the Pix action, official tutorial at 00:40.](assets/benchmark/nubank-review-0040.jpg)

[Watch review at 00:40](https://www.youtube.com/watch?v=e7qt92GdEWo&t=40s). **My reading:** interpreted input is exposed for checking before commitment. H4 should test whether a person catches a wrong amount or recipient; a shorter flow alone does not establish safer review.

![Nubank — transfer completed with recipient, value and access to the receipt, official tutorial at 00:50.](assets/benchmark/nubank-result-0050.jpg)

[Watch the result at 00:50](https://www.youtube.com/watch?v=e7qt92GdEWo&t=50s). **My reading:** the result names the outcome and retains transaction context. For H2/H3, Clara needs equally precise distinctions between approval, processing, uncertainty and settlement. The completion treatment must only appear after confirmed success. Personal Pix does not establish corporate approval or external-bank capabilities.

### Visual evidence: returning to work in Ramp

Official help-center images, collected October 14, 2026; visible example dates are from 2024. The red callouts are part of Ramp's source image. They document an interface example, not a verified latest release.

![Ramp — saved view, visible filter and bill statuses in the work queue. Official help-center image.](assets/benchmark/ramp-saved-views.png)

**My reading:** a task can return to a recognizable queue. For H2/H3, closing the guided payment should leave a findable request with its current state. Saved custom views are a future reference, not part of this two-day scope.

![Ramp — applied status filters and a menu including Next approver. Official help-center image.](assets/benchmark/ramp-filters.png)

**My reading:** status and responsibility can help locate work without rereading every row. I will test a named next actor in the payment detail before considering advanced filters.

Source: [Ramp — managing bills and payments](https://support.ramp.com/managing-bills-and-payments-on-bill-pay/).

### What this evidence supports — and what remains open

| Decision to explore | Visual anchor | Hypothesis / check |
| --- | --- | --- |
| Keep guidance beside the decision | Nubank entry; Mercury grouped form | H4: fewer rereads without missed errors. |
| Keep source identity visible during preparation and review | Mercury selected account in the existing request/review captures | H1: identify the account that will be debited. |
| Preserve the object while its state changes | Mercury upload sequence | H3: retain payment context during lookup and recovery. |
| Distinguish task completion from money movement | Mercury request-created result versus Nubank transfer-completed result | H2: correctly explain whether funds moved. |
| Return to a findable item after leaving the task | Ramp queue and filters | H2/H3: locate the request and identify the next action. |

These are design mechanisms to test, not evidence of measured gains. Wise's sending and tracking guides remain useful for service-state semantics, but the public PDF I inspected contains explanatory material rather than detailed flow screenshots. I have not presented it as visual proof. External-bank authorization, unknown outcomes and failure recovery still need direct evidence; the wireflow marks these service boundaries explicitly.

### What the current proposal needs to improve

I repeated technical explanations across connection, review and authorization. The source route, summary and alerts also repeat some information. A five-phase indicator currently combines preparation, an asynchronous company decision, a bank handoff and payment tracking; these are service states, not five equivalent form steps. I need to make the user's next action the organizing principle.

My next design iteration explores three task groups: **prepare the payment**, **review and request approval**, and **authorize and track**. A pending company approval belongs to an explicit status with a named responsible person. The bank handoff identifies the destination and the transaction being authorized. Payment tracking can continue after closing the task. The one-time preparation of an external account remains conditional on the provider journey, rather than an assumed extra consent for every payment.

The interface should instruct through a named account, verified recipient, amount emphasis, adjacent validation and an action naming its consequence. Longer service explanations move to optional details. Information required for consent and review remains visible at the point of commitment. Progress and confirmation support orientation; I have no evidence that rewards or gamification would improve this financial task.

### Refined hypotheses and controlled experiments

I keep O1 and the existing hypothesis IDs. I sharpen the mechanisms rather than add opportunities.

| ID | Refined hypothesis | Controlled comparison | What I observe | Evidence that challenges it |
| --- | --- | --- | --- | --- |
| O1-H1 · source decision | A named source with its route supports the correct funding decision without searching another view. | Same supplier and amount with named source versus the previous summary. Keep the payment path constant; compare A/B separately as service alternatives. | Completion, active time, switching and identified debited account. | Source confusion or unnecessary navigation. Service eligibility is assessed separately. |
| O1-H2 · next action | A concise status naming the responsible actor and action lets the person distinguish company approval, bank authorization and payment completion. | At the same service state, compare the earlier explanation-heavy prototype with a concise actor/action version. | Ask who acts next and whether funds have moved; record unprompted answers. | Approval is still interpreted as payment, or the next actor remains unclear. |
| O1-H3 · recovery | A retained request with distinct actions for definitive failure and uncertain outcome supports resumption without repeated entry or duplicate intent. | Use separate interruption and unknown-outcome tasks. Preserve the same transaction data. | Re-entered fields, chosen recovery action and intention to submit again. | Lost context, unsafe retry or an unclear current state. |
| O1-H4 · decision clarity | Emphasized amount and verified recipient, a named source account and adjacent field feedback help detect a planted review mismatch with less rereading than repeated explanatory alerts. | Compare the earlier prototype review with a compact decision-focused version; keep the service path and data constant. Include one intentionally incorrect amount or recipient in the test task. | Whether the mismatch is caught before requesting approval, details identified and rereading/hesitation. | More missed mismatches or faster completion caused by skipping review. |

In two days H1 tests the funding decision, H2 the meaning of commitment and H4 review correctness; H3 is a required recovery check; the service-path comparison is separately conditional on feasibility. If sessions are unavailable, I report a heuristic evaluation and an experiment plan, not validated hypotheses. I use formative observations rather than inventing targets such as a 30% improvement.

Sources: [Mercury payment-link guide](https://support.mercury.com/hc/en-us/articles/44220096132116-How-to-create-and-send-a-payment-link-in-Mercury), [Nubank Pix guidance](https://blog.nubank.com.br/pix-tudo-sobre/), [Wise sending guide](https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise), [Wise tracker](https://wise.com/help/articles/2452305/how-do-i-check-my-transfers-status), [Wise Platform status semantics](https://docs.wise.com/guides/product/send-money/tracking/transfer-statuses).

## Opportunity evaluation and selected focus

My desired outcome is to complete eligible supplier payments with less active operational effort while preserving company controls. I compare three needs at different decision moments. Each could lead to a focused initiative; I do not treat every stage of a payment as part of the selected opportunity.

| Opportunity and trigger | Evidence and confidence | User and business value to investigate | Scope and dependency |
| --- | --- | --- | --- |
| **O1 · Use the intended funds without managing a separate top-up task.** Trigger: a supplier needs payment and the money is at another bank. | Direct problem in the brief. Clara's public value proposition supports continuity in Accounts Payable. The demo establishes the payment entry point, not external initiation. | Reduce the work of organizing funding before paying; improve eligible payment completion through Clara. | Source choice, first connection, review and funding continuity for one Pix. Initiator, bank and PJ eligibility remain unverified. |
| **O2 · Get the required decision without chasing or re-explaining the payment.** Trigger: a request is waiting for another person's authorization. | Approval configuration and pending tasks are observed/documented. Chasing, delays and their frequency are assumptions. Conta Simples and Ramp provide relevant workflow patterns. | Reduce coordination and improve the quality of approval decisions. | Decision context, named responsibility and a resumable approval request. Actual role overlap, escalation and notification needs require discovery. |
| **O3 · Resolve an interrupted payment without losing context or paying twice.** Trigger: authorization stops, fails or returns an uncertain result. | Failure is required by the brief; statuses and failure causes are documented. Frequency and current recovery effort are unknown. Ramp and Wise provide bounded recovery/status references. | Reduce rework, duplicate attempts and avoidable support requests. | State-specific recovery and evidence of outcome. Depends on reliable status, reason codes, correlation and idempotency. |

### Why I select O1

**I select O1: make external funding part of preparing a supplier payment in Clara.** It addresses the explicit obstacle in the brief and naturally includes first connection, consent, Pix and a failure. It gives me a focused decision to design well: which account will fund this payment, what the person is agreeing to, and how the task continues after authorization.

| Selection criterion | O1 · funding continuity | O2 · decision coordination | O3 · recovery |
| --- | --- | --- | --- |
| Direct support in the brief | Strong: separate top-up is the stated problem. | Relevant dependency; the coordination pain is not established. | Required scenario; prevalence is not established. |
| Fit with Clara's value proposition | Connects organized supplier work to eligible external funds. | Reinforces existing spending control. | Reinforces confidence and transaction visibility. |
| Two-day case fit | One source, one recipient, one payment and one failure make a bounded vertical slice. | One approval handoff and its request detail fit; role assumptions need validation. | One interruption and one uncertain-result variant fit; reason/status assumptions need validation. |
| Main trade-off | Highest external-service dependency; UI work can be tested, production capability must be verified. | More of the visible workflow is inside Clara, but it weakens the connection to the funding challenge. | Strong state and recovery craft, but selecting it alone would leave first funding as background. |

This is a qualitative judgment, not a market-size estimate or a weighted score without data. O2 could become the priority if research shows approval coordination dominates active work; O3 could become the priority if failures and recovery dominate lost completions. If no eligible initiation service supports O1, I would revise the service proposal before promising its delivery.

For this case, O2 contributes the minimum company-approval state and O3 contributes the required recovery branch. I will not build a new approval engine, escalation system or exception center. Repeated suppliers and batch execution remain future extensions, outside this three-branch tree.

### Alternatives under O1

**Service alternatives:** A pays the supplier directly from the external account; B initiates a top-up into Clara and then pays the supplier. Both require capability verification. B still has two money movements even if the interface keeps them in one payment task. A may remove the funding movement; neither alternative removes necessary bank authorization.

**Interaction alternatives:** compare a compact grouped form with a guided task that reveals external-source preparation when needed. Both keep the same recipient, amount, source information and approval policy. The choice of a wizard or dialog is a design decision to evaluate, not the opportunity itself. I will build one interaction direction in high fidelity and retain the other as a focused comparison.

### Control boundary and customization limits

| Surface | What I can propose | What requires confirmation |
| --- | --- | --- |
| Clara payment preparation and review | Grouping, named source, recipient confirmation, validation, editing and action labels. | The missing current review detail; available account and beneficiary data. |
| Existing company approval | Preserve configured policy and show the next responsible actor. | Actual permissions, overlapping roles and rules when payment details change. |
| Connection and bank handoff | Explain purpose, destination and transaction; preserve context for return. | Eligible initiator/partner, supported banks/PJ accounts and required consent journey. |
| External bank experience | Represent the handoff boundary in the service map. | Bank authentication, MFA, signatories and screens are outside my design control. |
| Return and outcome | Show authoritative state, retained request, receipt and valid recovery. | Callback correlation, status reconciliation, supported reasons and backend duplicate prevention. |

Clara's public legal footer does not establish the initiation capability required for this proposal. My interface is a proposal, not evidence of configurable bank screens or a production-ready integration. I can validate comprehension and task continuity before those dependencies are resolved; I cannot use a successful prototype walkthrough as proof of technical feasibility.

### What this scope lets me demonstrate

| Brief requirement | Concrete artifact within O1 |
| --- | --- |
| Problem and metric | Evidence-linked opportunity, primary active handling time and later unique-intent completion metric. |
| Pix and Open Finance | A/B money-route comparison, ownership boundaries and unresolved PJ dependencies. |
| First connection and consent | Contextual source preparation, understandable permission and bounded bank handoff. |
| One payment and a failure | Reviewed Pix, required decisions, interrupted authorization and safe return. |
| Explored alternatives | Service-path trade-offs and a focused form-versus-guided-task comparison. |
| Reuse and DS contribution | Shared fields, status, review and wizard patterns; an accessible source-selection/review pattern with its API and contract. |
| AI use and judgment | Record the Astra critique, the changes I accepted and what still needs evidence. |

The end-to-end contribution is the connection between evidence, a bounded product choice, detailed interaction, accessible UI, service states and a testable implementation. The existing prototype remains a first iteration to refine against this decision.

Sources: the private brief summarized in Brief and evaluation criteria; [Clara Accounts Payable](https://www.clara.com/pt-br/produtos/contas-a-pagar); the linked Clara evidence in Current journey; and the reference-specific limits in Desk research.

## Experiment plan for the selected opportunity

These are planned formative checks. The two-day goal is a reviewable interaction proposal with recorded issues and decisions. I will report participant roles, actual count, tasks and limitations when sessions occur. If recruitment is unavailable, I will record an expert walkthrough and leave the user hypotheses open.

### A bounded test sequence

| Task | Observe before asking follow-up questions | Hypothesis and decision |
| --- | --- | --- |
| Prepare one supplier payment using Bank A, with Bank B also available. | Source choice, extra navigation, repeated information and active time. Then ask which account will be debited and what happens to the funds. | H1: revise if source or route is misunderstood. |
| Review a request containing one mismatch against the task information. | Whether the mismatch is caught and corrected before commitment; do not tell the person where it is. | H4: compare equivalent proposal variants; reverse order where feasible to reduce learning effects. |
| Request the required decision and continue toward bank authorization. | Whether the action's consequence is understood. Then ask who acts next and whether the supplier is paid. | H2: revise confident misinterpretations of permission or settlement. |
| Return after interrupted authorization; separately inspect an unknown result. | State interpretation, fields re-entered, chosen recovery action and attempted new submission. | H3: any unsafe retry or loss of required context blocks consolidation. |

I will keep data, service path and approval policy equivalent when comparing UI variants. Comparing direct payment with linked top-up is a separate service assessment, because changing the money route and interface together would obscure what caused an observed difference. A demonstration of a simulated bank cannot measure real bank waiting or authentication effort.

### Metrics and decision rules

**Primary experience measure:** active handling time for an equivalent, correctly completed task. Start when work on the intended payment begins, include preparatory funding and retries, and record passive waiting separately. Report individual observations and, when useful, the median; show failed and abandoned tasks alongside successful ones so a faster average cannot hide failures. A comparison with the existing operation requires observing it or explicitly labeling a reconstruction.

**Comprehension and safety checks:** correct source, detected mismatch, understood commitment, correct next actor, and safe recovery. Record assistance and unnecessary navigation. A confident wrong-source or approval-as-settlement interpretation, unsafe repeat submission or inaccessible essential action is a critical issue to revise and recheck. Fewer clicks or faster completion do not compensate for these errors.

**Later business metric:** unique eligible payment intents reaching authoritative supplier settlement divided by unique eligible intents started, within a defined observation window. Define eligibility before counting; retries remain the same intent. Segment first use versus repeat use and direct versus two-leg routes. Track active effort, end-to-end elapsed time, support demand and duplicate payments separately. I have no baseline for a numeric uplift target.

The current prototype covers a fictional account and supplier. Its interaction log records events, not measured user comprehension or production settlement. Same-session close/resume is implemented; refresh and cross-device draft recovery remain engineering work. A pilot would require persistent request identity, authorization checks, status reconciliation and backend idempotency.

## Brazil constraints and feasible scope

I am designing for Brazilian business accounts and Pix. Open Finance involves consent, authentication at the account-holding institution and confirmation of the operation. A connected account does not by itself authorize every future payment. I will use a bank-redirection journey as the conservative prototype assumption, and keep company approvals separate from bank authorization. [Central Bank: Open Finance customer journey](https://bcb.gov.br/estabilidadefinanceira/cliente-open-finance?modalAberto=credito-personalizado), [Central Bank: payment initiation](https://www.bcb.gov.br/detalhenoticia/568/noticia).

Before a production implementation, the authorized initiator or partner, participating banks, PJ account eligibility, authorized representatives, bank approval layers, limits and current journey specifications would need confirmation. I document these as implementation dependencies. Bank selection should reflect verified eligibility, not imply that every bank or business account is supported. I have not established Clara's authorization or partner setup for this feature. The normative pages for Resolution 406 and Instruction 760 did not expose their full text in the research tool; their current applicability remains a verification task rather than a settled design claim.

For privacy, the LGPD's purpose, necessity, transparency and security principles inform minimizing data in the interface and prototype. Open Finance payment consent and the legal basis for other personal-data processing are separate considerations. Personal data can appear even in a business-account journey; a legal review must define lawful basis, retention, roles and notices before production. This case uses fictional data and stores no real credentials. [LGPD, especially Articles 6, 7 and 46](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).

For accessibility I will check keyboard access, visible focus, labels, textual errors and status messages. A 32 px visual control can remain compact while respecting applicable target-size and spacing requirements; dense icon actions need particular review. I am using WCAG 2.2 as a checking reference, not claiming certified conformance. [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

**In scope:** one supplier, BRL, one Pix payment, two fictional source choices with one account connected in the task, first connection, payment-specific authorization, existing company approvals, result tracking and one main recovery scenario. The illustrated bank is a placeholder, not an eligibility claim.

**Out of scope:** batch execution, recurring or automatic Pix, FX, a full bank-management module, no-redirection promises, real integrations and a complete compliance implementation. These can be discussed as dependencies or future opportunities.

## Two-day delivery plan

| Window | Work | Reviewable output |
| --- | --- | --- |
| Day 1 — frame and decide | Finish this bounded desk research; compare the two money paths; identify PJ dependencies; choose the prototype assumption | Opportunity tree, rationale, journey and state map |
| Day 1 — build | Reuse the DS for first connection, payment entry and review | A compact high-fidelity happy path |
| Day 2 — recovery and checks | Add authorization interruption, processing and unknown outcome; run available usability or heuristic checks | Clickable prototype, issues and explicit limitations |
| Day 2 — prepare the walkthrough | Refine hierarchy and copy; document alternatives, DS contribution and AI use; rehearse | A 30-minute walkthrough with 15 minutes for discussion |

Friday's presentation should make my judgment visible: what I observed, why I selected this opportunity, how the flow protects approvals and authorization, what I learned from checks and what still depends on implementation validation. I will prioritize one coherent experience over an expanded feature set.

## Discovery: empathy map and user voice

I focus on the finance manager in the brief: a company with 200 employees, two traditional banks and dozens of supplier payments each week. The employee count describes the organization; it does not establish 200 payment users. Requester, company approver and bank-authorized representative are responsibilities whose overlap remains unknown.

My working scenario is a supplier payment with funds at another bank. I add a company decision and an interrupted authorization as test conditions, rather than observed details of a particular customer's routine.

| Empathy lens | Established evidence | Working need and neutral discovery prompt | Decision it informs |
| --- | --- | --- | --- |
| Does | The brief describes opening the bank, funding Clara, returning and paying. | What information is repeated or kept elsewhere? “Walk me through the last payment like this.” | O1: preserve the funding decision in the payment task. |
| Thinks | Payment details and company approval rules are documented. | Which details determine readiness? “What do you check before continuing, and why?” | H1/H4: source identity, recipient, amount and review hierarchy. |
| Feels | No emotional evidence has been collected. | An interruption may introduce uncertainty. “What information would you need to decide what to do next?” | H3: authoritative outcome and a valid recovery action. |
| Says | No interview quotes have been collected. | “What happened here?” “What would you tell the supplier?” | H2: distinguish a created request, authorization and settlement. |
| Pain | Separate funding is explicit; chasing approvers and repeated checking are unverified. | “Where do you spend time doing something, and where are you waiting?” | Compare O1 with O2/O3 using actual active effort and waiting. |
| Gain | The task requires paying the supplier with the necessary controls. | “What tells you this work is finished?” | Confirmed outcome and retrievable evidence; verify whether these resolve the user's task. |

The map is provisional. I will record exact observations, role, task and the design decision they change. I will not turn assumed feelings into quotations or treat competitor behavior as a user interview.

For Clara, the candidate value is easier completion of eligible supplier operations in Accounts Payable. The current evidence supports investigating effort reduction; adoption, repeat use and completion uplift require customer and production evidence. Safe authorization, correct source and no duplicate payment remain guardrails.

## Jobs to be done and decision traceability

**Primary job, inferred from the brief:** When I need to pay a supplier and the funds are at another bank, help me use the intended account within the payment task, so I can complete the work without organizing funding separately. Required company decisions, bank authorization and recovery constrain how I deliver this job.

**Business job:** Make eligible supplier operations easier to complete and track within Clara's Accounts Payable workflow. Completion and repeat use need a baseline and pilot; the case does not claim measured commercial impact.

| Job fragment | Selected need | Hypothesis | Design artifact | Check |
| --- | --- | --- | --- | --- |
| Use the intended funds | Decide the source in payment context | O1-H1 | Named source account and visible route | Identify the debited account without prompting. |
| Request the right decision | Understand what the next action commits to | O1-H2 | Review, approval state and bank handoff | Distinguish company approval, bank authorization and money movement. |
| Resume interrupted work | Keep the request and resolve its state | O1-H3 | List entry, return detail and recovery action | Resume without repeated input or duplicate intent. |
| Confirm the right supplier and amount | Catch a mistake before commitment | O1-H4 | Decision-focused review and field feedback | Detect a planted mismatch and correct it. |

The finance manager is the focal role. Internal and bank authorization responsibilities may be held by different people; I keep the handoff explicit and verify the actual role model before implementation.

## Hypothesis portfolio by opportunity

I select O1: use the intended bank funds within the supplier-payment task. H1, H2 and H4 are the experience hypotheses; H3 is a required recovery guardrail. I preserve these IDs so the existing prototype log and contract remain traceable. O2 and O3 each have two candidate hypotheses for future investigation, without expanding the selected build.

| ID and mechanism | Falsifiable hypothesis | Test and evidence that would challenge it |
| --- | --- | --- |
| **O1-H1 · source decision** | A named bank/account and explicit route in payment context let the person select and identify the intended source without opening another view. | Assign Bank A while Bank B is available. Observe selection, then ask what will be debited. Wrong source, misunderstanding of the two-leg route or navigation needed to identify the account challenge the design. |
| **O1-H2 · meaning of commitment** | Concise action/consequence wording at review and bank handoff lets the person distinguish requesting company approval, authorizing a transaction and confirming supplier payment. | At commitment boundaries, ask what the action permits and whether money has moved. Connection interpreted as unrestricted permission, or approval interpreted as payment, requires revision. |
| **O1-H4 · review correctness** | Grouping recipient, amount and funding source around the decision helps the person catch an incorrect value before submission without increasing omissions elsewhere. | Compare two proposal variants with equivalent tasks and one planted mismatch each; vary order and mismatch location. More missed errors, or speed gained by skipping review, challenges the hypothesis. |
| **O1-H3 · recovery guardrail** | Retaining the request and offering state-valid actions supports resumption without unnecessary re-entry or a second submission while the result is unknown. | Separately interrupt authorization and return an unknown execution result. Observe the state explanation and next action. Lost context or duplicate intent blocks consolidation. Closing/reopening currently retains data only in the same session. |
| **O2-H1 · responsibility** | Naming the responsible actor and blocker helps identify the correct next action across a mixed payment queue. | Compare status-only and actor/blocker rows. Wrong actor or acting on a request that is merely waiting challenges the hypothesis. |
| **O2-H2 · decision context** | A contextual approval request provides enough information to decide without asking the requester to explain the payment again. | Give an approver representative requests; observe missing-information questions and source/amount comprehension. Missing essentials or obscured decisions challenge the hypothesis. |
| **O3-H1 · outcome discrimination** | Distinguishing not authorized, confirmed failed and outcome unknown produces safer recovery choices than a generic error. | Test the states separately. Retrying an unknown result, treating an interrupted redirect as proof of no debit, or not finding the valid action challenges the hypothesis. |
| **O3-H2 · remedy** | A supported failure reason with a specific remedy enables recovery while retaining correct information. | Test two provider-supported reason scenarios once available. An inappropriate remedy, repeated entry or reuse of invalid approval/consent challenges the hypothesis. |

O1-H2 tests comprehension at the selected payment's commitment boundaries; O2 tests coordination across people and requests. O1-H3 is the minimum safe failure branch; O3 would investigate a broader exception-resolution service. This distinction keeps the tree from turning into three overlapping delivery tracks.

I will compare an earlier prototype with a revised proposal, not claim to compare against Clara's complete current review, which I have not observed. Benchmark patterns suggest mechanisms; they do not validate these hypotheses.

## Behavior, feedback and accessible interaction

I translate each principle into a behavior I can observe. My cognitive-science lens concerns attention, recognition and the work of keeping context between steps. These principles guide design choices; they do not establish a neurological effect or prove that this proposal reduces cognitive load. I will use errors, omissions, repeated navigation and participant explanations as practical indicators.

| Principle | Trigger and proposed response | What I would check |
| --- | --- | --- |
| Recognition over recall | After choosing a source, keep institution, account identity and recipient available in review and on return. | Can the person identify the debited account without going back or memorizing the previous screen? |
| Proximity and visual hierarchy | At review, group amount, recipient and source as the decision unit; keep edit actions beside the relevant information. | Does the person catch a mismatch before committing? Faster completion with a missed error is a worse result. |
| Progressive disclosure | When an external source is selected, expose its relevant connection state and next action. Keep required consent information visible; put supplementary explanation in optional details. | Can the person explain the action and find additional information without prompting? |
| Visibility of status | After a request, bank return or status update, name what is confirmed, what is still unknown and who acts next. | Does the person distinguish request creation, company approval, bank authorization and settlement? |
| User control and error prevention | Before commitment, allow review and correction; after interruption, preserve the request and offer a state-valid action. | Can the person revise safely and resume without unnecessary re-entry? Unknown payment outcomes must not offer a second submission. |
| Feedback and orientation | On a verified step completion, show a concise milestone and the next available action. Keep asynchronous waiting separate from form progress. | Does progress help orientation without implying that money has moved or making the person rush? |

Recognition, system visibility, user control and error prevention follow [Nielsen's usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) and the [recognition and recall explanation](https://www.nngroup.com/articles/recognition-and-recall/). Logical grouping and retained input are also described in [W3C's multi-page form guidance](https://www.w3.org/WAI/tutorials/forms/multi-page/). Their application to this particular finance task remains a design hypothesis.

### Gamification: a bounded exploration

I would explore truthful progress and a completion checklist as optional orientation mechanisms: identify the source, check the recipient and review the request. A completed item represents a completed user task, not bank approval or payment settlement. The useful question is whether the person understands what remains and can resume with less effort. A progress indicator by itself is standard feedback; I would not present it as evidence that gamification improved engagement.

The comparison is a labeled task sequence versus a small checklist, with the same information and actions. I would observe orientation, missed review details and perceived pressure. I would drop the extra checklist if it duplicates the step indicator or encourages skipping checks. Points, streaks, rankings, artificial urgency and rewards for sending more money have no demonstrated role in this brief.

An [experimental study of gamified financial platforms](https://www.journals.uchicago.edu/doi/abs/10.1086/726431) found changes in financial risk-taking in its studied context. That context does not establish an effect in B2B supplier payments; it reinforces why I would test the specific mechanism rather than assume that engagement is always beneficial.

### Accessibility as acceptance criteria

| Decision | Concrete check before presenting | Reference |
| --- | --- | --- |
| Review and correction | Recipient, amount and source can be checked and corrected before commitment; the action states its consequence. | [WCAG 3.3.4: financial error prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) |
| Retained context | Back, cancel and resume preserve valid information; necessary security revalidation is explained. | [WCAG 3.3.7: redundant entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) |
| Dynamic feedback | Loading, validation and returned results have programmatic announcements; routine updates do not steal focus or repeat incessantly. | [WCAG 4.1.3: status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) |
| Keyboard and focus | Complete preparation, editing and recovery with the keyboard; visible focus follows the task and returns to its trigger when a dialog closes. | [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) |
| Visual and cognitive access | Labels remain visible, errors use text and not color alone, zoom/reflow preserves actions, contrast and target sizes are checked. Motion respects reduced-motion preference. | [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) |

These are planned checks, not a claim of accessibility conformance. I will record the browser, assistive technology where used, task, issue and correction. An expert walkthrough is useful when recruitment is limited, but does not replace sessions with disabled users.

## Design and engineering contributions

I organized the case around a traceable sequence: brief → product context → observed journey → provisional user understanding → desk research → opportunity → hypotheses → proposed experience. This lets me explain why a screen or interaction belongs in the flow, rather than presenting UI without its reasoning.

For design craft, I established compact typography, proximity rules, a neutral palette, control sizes, radii and restrained surface elevation. I revised component examples and shared patterns against that foundation. The independent DS documentation exposes working examples, source code and a contract so the same decisions can carry from the case hub into the proposal.

For implementation continuity, I built the hub in React and TypeScript, with a public component API, a token/component registry and generated manifests. Build checks cover generated artifacts, registered components, selected import boundaries and token rules. The repository includes a reproducible npm build and CI verification. These checks support consistency; they do not establish complete accessibility or product-flow validation.

The trade-off is deliberate: I am using a local reusable foundation to prototype and review the experience within two days. I have not built a financial backend, connected real bank APIs, validated an initiator partnership or executed a payment. Those boundaries keep the prototype reviewable without overstating feasibility.

My work is visible in the framing, scope decisions, research synthesis, interface critique, component rules and review of AI output. The AI work log records what was assisted and what remains unverified. User validation and business results will be added only when they exist.

## Low-fidelity wireflow and motion exploration

I added a clickable wireflow before refining the high-fidelity prototype. Its neutral surfaces and dashed boundaries keep the discussion on sequence, information, commitments and recovery. The surrounding Payments workspace remains visible; bank panels represent an external service boundary, with explicit exploration controls rather than invented bank screens.

The flow covers source selection, first connection, recipient lookup, amount, review, company approval, bank handoff and outcome. I can close and reopen the same request in the current session, return before authorization, and choose confirmed success, confirmed failure or an unknown result. Direct payment and linked top-up use the same service-state reducer as the earlier prototype. A top-up result remains separate from supplier settlement, and an unknown result exposes status checking instead of a new submission.

| Interaction | Purpose | Exploration check |
| --- | --- | --- |
| Account selection feedback | Make the chosen source visible before connection. | H1: identify the bank and distinguish the route. |
| Lookup loading and recipient confirmation | Show that validation is happening and when data becomes available. | H4: check the returned identity before review. |
| 160 ms phase transition and heading focus | Preserve orientation between task views. | Keyboard focus reaches the new heading; movement can be disabled and respects reduced motion. |
| Approval and bank-return feedback | Distinguish the recorded company decision from money movement. | H2: explain what has happened and what the next action permits. |
| Processing and same-request status check | Make waiting visible without inviting a duplicate. | H3: recover using the existing request. |

The 500 ms lookup and 1 second service response are illustrative interaction timings, not estimates of a real bank API. Design notes are outside the payment task. The source-path selector restarts the exploration; form data is not persisted across reloads. Approval outcomes and bank returns are controlled walkthrough actions, not real role-based operations. The existing high-fidelity prototype remains available separately.

I will use this wireflow to identify unnecessary steps, missing information and confusing actions before committing to the final container, motion and visual treatment. The shared DS checks now include the wireflow consumer and its token usage.

## Prototype implementation and comparison

I built an interactive proposed workspace with its own sidebar and header, connecting Overview, Payments, Approvals, Accounts and Activity. The selected opportunity is O1: use the intended bank funds within the payment task. This first iteration predates the refined test plan; it is not evidence that the hypotheses have been validated. The surrounding views expose the source, responsible actor and payment outcome rather than placing the feature in an isolated form.

Path A pays the supplier directly from the external account. Path B first funds Clara and then releases a supplier payment. I am exploring A as the initial design direction because it removes the separate funding task in the brief; eligibility and initiator capability remain assumptions to confirm. Both paths can be exercised in the prototype before I consolidate that decision.

The first connection is separate from payment authorization. A request goes through one illustrative company approval before a bank-authorized representative confirms the transaction in a simulated bank handoff. On return, the draft and approval remain available. A confirmed top-up is labeled independently from a supplier payment.

The prototype includes beneficiary lookup against a fictional fixture, amount validation, review, company approval, bank authorization, processing, confirmed failure, unknown outcome and a final receipt example. Test controls select the next response. Unknown outcomes only allow querying the same payment intent; a confirmed second-leg failure on Path B preserves the completed top-up instead of repeating it.

| Hypothesis | Implemented surface | Available evidence |
| --- | --- | --- |
| O1-H1 | Named source and route; both money paths are service alternatives | Prototype task comparison; active time still requires a user test record |
| O1-H2 | Review, company approval, bank handoff and next-actor copy | Explain each stage and debited account during a walkthrough |
| O1-H3 | Authorization cancellation, confirmed failure and unknown-outcome recovery | Interaction log plus tests of state transitions and duplicate-send guards |
| O1-H4 | Grouped source, recipient, amount and related action using the DS | Visual and comprehension review; user observations still to collect |

The local log records prototype events and can be exported from Test controls. It is not a user-validation result. Automated tests cover review prerequisites, approval gating, cancellation recovery, direct confirmation, top-up versus supplier settlement, unknown-result guards and stale responses. Bank and payment responses are simulated; production duplicate prevention still requires a backend contract.
