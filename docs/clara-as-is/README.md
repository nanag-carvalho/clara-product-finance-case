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

The opportunity I want to explore is preparing and resuming an externally funded supplier payment with source, approvals and outcome clear within Payments. This could reduce operational effort and make Clara more useful in everyday accounts payable, but I still need to validate whether it increases adoption and repeat use. I do not have internal abandonment, revenue or transaction-volume data to quantify the opportunity.

| Business and experience hypothesis | Signal I would track | How I would investigate |
| --- | --- | --- |
| If a separate top-up makes payment harder, integrating an external source could improve completion | Completed payments / eligible attempts; abandonment by stage | Compare current and proposed task flows, then instrument a pilot |
| If source and authorizations are clear, requesters and approvers could decide with fewer doubts | Source comprehension; selection errors; help requests | Test review and approval with different company roles |
| If returning from the bank preserves context and outcome, recovery could require less rework | Successful resumptions; active recovery time; duplicate attempts | Simulate return, refused authorization and unknown outcomes |
| If external funds fit the routine, Clara could concentrate more supplier operations | Repeat-use companies; eligible payment frequency and volume | Evaluate recurring usage in a pilot, accounting for seasonality and company profile |

My candidate primary metric is the completion rate of eligible payments funded by an external account. Active finance-team time would be complementary: I would separate interface work from waiting for approvers and the bank. Targets require a baseline first. Guardrails would cover duplicate payments, incorrect funding sources and execution without required authorizations.

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

## Hypotheses for the next stage

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

## UI references and design criteria

I inspected the publicly documented Ramp approval-list image below. Its restrained surfaces, line tabs, aligned amount column and visible next approver make it a useful working-interface reference. That is my visual judgment, not a measured usability result. The row includes a 2024 date; the image does not establish the newest authenticated UI.

![Ramp official reference — approval queue, not Clara evidence](https://assets.ramp.com/help-center/bill-lifecycle/attachments/31223416533523.png)

The same guide publishes a draft-detail reference. I would use these screens to compare list/detail organization and action placement, while preserving Clara's navigation and the case DS.

![Ramp official reference — bill draft detail, not Clara evidence](https://assets.ramp.com/help-center/bill-lifecycle/attachments/31223370842899.png)

My interface criteria are compact productive typography, a neutral Slate palette, visible funding source, one primary action per stage and separation between approval and payment outcome. Modern appearance should support comprehension and trust. I will reuse the existing DS rather than introduce another visual language.

Source: [Ramp bill lifecycle and original images](https://support.ramp.com/bill-lifecycle/). These are external visual references, not additions to the observed Clara journey.

## Interaction benchmark: Mercury, Nubank and Wise

I refined the interaction benchmark after comparing the Mercury screenshots supplied for this case with official Nubank and Wise guidance. This complements the three competitor references; it does not expand the feature scope. The evidence types matter: I inspected Mercury screenshots, while the Nubank and Wise flows below are documented behavior, not authenticated interface observations.

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

### What the current proposal needs to improve

I repeated technical explanations across connection, review and authorization. The source route, summary and alerts also repeat some information. A five-phase indicator currently combines preparation, an asynchronous company decision, a bank handoff and payment tracking; these are service states, not five equivalent form steps. I need to make the user's next action the organizing principle.

My next design iteration uses three task groups: **prepare the payment**, **review and request approval**, and **authorize and track**. A pending company approval belongs to an explicit status with a named responsible person. The bank handoff identifies the destination and the transaction being authorized. Payment tracking can continue after closing the task. The one-time preparation of an external account remains conditional on the provider journey, rather than an assumed extra consent for every payment.

The interface should instruct through a named account, verified recipient, amount emphasis, adjacent validation and an action naming its consequence. Longer service explanations move to optional details. Information required for consent and review remains visible at the point of commitment. Progress and confirmation support orientation; I have no evidence that rewards or gamification would improve this financial task.

### Refined hypotheses and controlled experiments

I keep O1 and the existing hypothesis IDs. I sharpen the mechanisms rather than add opportunities.

| ID | Refined hypothesis | Controlled comparison | What I observe | Evidence that challenges it |
| --- | --- | --- | --- | --- |
| O1-H1 · source decision | A named source with its route supports the correct funding decision without searching another view. | Same supplier and amount with named source versus the previous summary. Keep the payment path constant; compare A/B separately as service alternatives. | Completion, active time, switching and identified debited account. | Source confusion or unnecessary navigation. Service eligibility is assessed separately. |
| O1-H2 · next action | A concise status naming the responsible actor and action lets the person distinguish company approval, bank authorization and payment completion. | At the same service state, compare the current explanation-heavy version with a concise actor/action version. | Ask who acts next and whether funds have moved; record unprompted answers. | Approval is still interpreted as payment, or the next actor remains unclear. |
| O1-H3 · recovery | A retained request with distinct actions for definitive failure and uncertain outcome supports resumption without repeated entry or duplicate intent. | Use separate interruption and unknown-outcome tasks. Preserve the same transaction data. | Re-entered fields, chosen recovery action and intention to submit again. | Lost context, unsafe retry or an unclear current state. |
| O1-H4 · decision clarity | Emphasized amount and verified recipient, a named source account and adjacent field feedback help detect a planted review mismatch with less rereading than repeated explanatory alerts. | Compare the current review with a compact decision-focused version; keep the service path and data constant. Include one intentionally incorrect amount or recipient in the test task. | Whether the mismatch is caught before requesting approval, details identified and rereading/hesitation. | More missed mismatches or faster completion caused by skipping review. |

In two days I prioritize H2 and H4 as experience experiments within the selected flow; H3 is a required recovery check. H1 tests the source decision; the service-path comparison is separately conditional on feasibility. If sessions are unavailable, I report a heuristic evaluation and an experiment plan, not validated hypotheses. I use formative observations rather than inventing targets such as a 30% improvement.

Sources: [Mercury payment-link guide](https://support.mercury.com/hc/en-us/articles/44220096132116-How-to-create-and-send-a-payment-link-in-Mercury), [Nubank Pix guidance](https://blog.nubank.com.br/pix-tudo-sobre/), [Wise sending guide](https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise), [Wise tracker](https://wise.com/help/articles/2452305/how-do-i-check-my-transfers-status), [Wise Platform status semantics](https://docs.wise.com/guides/product/send-money/tracking/transfer-statuses).

## Opportunity evaluation and selected focus

My desired outcome is to complete eligible supplier payments with less active operational work while preserving company controls. I reframed the opportunities as user needs within Clara, rather than selecting a banking integration as the opportunity.

| Branch | User need and evidence | What I can design in Clara | Dependency and scope decision |
| --- | --- | --- | --- |
| O1 · Prepare a payment that is ready to execute | Brief: separate funding task; demo: beneficiary, value, approval and status are scattered across views. | Source decision, verified recipient, focused review, next responsible actor and a resumable request. | Selected. One Pix to one supplier; eligibility and authoritative data remain service dependencies. |
| O2 · Know which payment needs my action | Demo: Tasks and Payments expose pending work, statuses and waiting age. | Priority, actionable state and movement from list to payment detail. | Supporting navigation in O1. A full prioritization engine is deferred; urgency logic needs evidence. |
| O3 · Resolve an exception without starting over | Brief explicitly requires a failure scenario; the demo shows failed/rejected statuses without observed recovery details. | Retained context, distinct retry/query actions, reason and transaction history. | One recovery branch within O1. Backend reconciliation and duplicate prevention are mandatory dependencies. |
| O4 · Repeat supplier work with less setup | Brief: dozens of payments weekly; Clara documents batch capability. | Reuse confirmed recipient/source context for eligible repeat work. | Deferred. Batch, saved beneficiaries and account policies would expand scope and permissions. |

**Selected opportunity: help the finance manager prepare and resume an externally funded supplier payment with the context needed to make the next decision.** I own the proposed experience from Payments entry to review, internal approval, bank-handoff preparation, return and outcome detail. The external bank remains a clearly bounded touchpoint.

This fits Clara's public emphasis on centralized supplier payments and transaction visibility. It also gives me a coherent end-to-end design case: evidence synthesis, task framing, prioritization, interaction alternatives, UI hierarchy, shared components, a service-state contract and validation. The selection is grounded in user/business value and a feasible delivery surface, not in maximizing visual screen count.

Direct external payment and top-up then pay are **service alternatives under O1**, not separate user opportunities. I retain the comparison and document dependencies, but do not make an unverified initiation capability the evidence of my design's value. Path A is conditional; Path B must still distinguish confirmed funding from supplier payment.

### Control boundary and customization limits

| Surface | Evidence of control | Proposal or dependency |
| --- | --- | --- |
| Payments list, fields, review and navigation | Observed Clara surfaces; review detail partially documented. | I can propose layout, grouping, validation, source context and explicit actions. A proposal is not proof of deployable configuration. |
| Company approvals | Existing rules and approval configuration documented. | Reuse the configured policy and show its actor/status; do not bypass it or invent a new permission model. |
| Entry to the bank | Product can prepare the handoff in this proposal. | Verify eligible banks, provider capabilities, consent content and safe redirect/callback handling. |
| Bank authentication and authorization | External institution controls the experience. | Show a bounded handoff storyboard, not a proposed bank redesign. No assumption about changing its screens, MFA or signatories. |
| Return, status and recovery | Clara can present correlated service results if integration supplies them. | Preserve request identity, reconcile each money leg and offer only valid actions. Real-time data and reason codes require provider support. |

Clara's current public legal footer describes its authorized issuance roles and indirect Pix participation; this does not establish an initiation capability for this proposal. I need confirmation of the authorized initiation service or partner before production. No public material reviewed establishes how much an external bank flow can be customized.

Sources: [Clara Accounts Payable and legal footer](https://www.clara.com/pt-br/produtos/contas-a-pagar), the private brief summarized above, and the observed/demo evidence in Current journey.

## Experiment plan for the selected opportunity

These experiments are planned, not completed. In two days I can build the prototype and run lightweight checks if participants are available. Any session results, participant count and limitations will be recorded separately; a small usability check cannot establish commercial impact.

For each trial I will record whether the participant completes without prompting, identifies the source correctly, names the next actor and understands the final state; active time excludes simulated bank waiting. Critical issues are a wrong source, confusing approval with settlement, losing the draft or attempting a duplicate while the outcome is unknown. Any critical issue blocks consolidating the proposed flow until I revise and recheck it. This is a formative decision rule, not a statistical claim of improvement.

The first prototype will show one happy path and a bank-authorization interruption with a preserved draft. I will also show processing and an unknown-outcome state so recovery does not imply a second payment. A confirmed payment only appears after a simulated final response. Backend duplicate prevention is a technical dependency; disabling a button alone is insufficient.

If user sessions are unavailable, I will perform a heuristic walkthrough and label it as such. Business validation would later compare eligible completion and repeat use against a baseline, with duplicate-payment and source-selection guardrails.

## Brazil constraints and feasible scope

I am designing for Brazilian business accounts and Pix. Open Finance involves consent, authentication at the account-holding institution and confirmation of the operation. A connected account does not by itself authorize every future payment. I will use a bank-redirection journey as the conservative prototype assumption, and keep company approvals separate from bank authorization. [Central Bank: Open Finance customer journey](https://bcb.gov.br/estabilidadefinanceira/cliente-open-finance?modalAberto=credito-personalizado), [Central Bank: payment initiation](https://www.bcb.gov.br/detalhenoticia/568/noticia).

Before a production implementation, the authorized initiator or partner, participating banks, PJ account eligibility, authorized representatives, bank approval layers, limits and current journey specifications would need confirmation. I document these as implementation dependencies. Bank selection should reflect verified eligibility, not imply that every bank or business account is supported. I have not established Clara's authorization or partner setup for this feature. The normative pages for Resolution 406 and Instruction 760 did not expose their full text in the research tool; their current applicability remains a verification task rather than a settled design claim.

For privacy, the LGPD's purpose, necessity, transparency and security principles inform minimizing data in the interface and prototype. Open Finance payment consent and the legal basis for other personal-data processing are separate considerations. Personal data can appear even in a business-account journey; a legal review must define lawful basis, retention, roles and notices before production. This case uses fictional data and stores no real credentials. [LGPD, especially Articles 6, 7 and 46](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).

For accessibility I will check keyboard access, visible focus, labels, textual errors and status messages. A 32 px visual control can remain compact while respecting applicable target-size and spacing requirements; dense icon actions need particular review. I am using WCAG 2.2 as a checking reference, not claiming certified conformance. [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/).

**In scope:** one supplier, BRL, one Pix payment, one illustrated external business account, first connection, payment-specific authorization, existing company approvals, result tracking and one main recovery scenario. The illustrated bank is a placeholder, not an eligibility claim.

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

I use the brief's 200-employee company as an operating context, not a population of 200 payment users. The focal user is the finance manager preparing dozens of supplier payments each week across two banks. The requester, internal approver and bank-authorized representative are responsibility lenses; I have not established how many people hold them or whether some roles overlap.

My practical scenario is one supplier payment due today, funds at a traditional bank, company approval required and an interruption before completion. This lets me inspect decisions and handoffs within a bounded task.

| Task lens | Evidence or assumption | Practical need to validate | Design implication within Clara | Test prompt |
| --- | --- | --- | --- | --- |
| Does: prepares the supplier payment | Brief: finance manager switches to a bank for top-up; demo: Payments lists beneficiary, value and status. | Keep supplier and amount while choosing the funding source. | A payment draft with named source and verified recipient. | Prepare this supplier payment using Bank A. What would be debited? |
| Thinks: checks whether the request is ready | Inference; approval workflows are documented. | Notice missing or incorrect information before commitment. | Decision-focused review; adjacent validation; amount and recipient emphasis. | Something in this request is incorrect. What would you change? |
| Feels: needs confidence at a handoff | Assumption to investigate, not a collected emotion. | Know what will happen outside Clara and how to resume. | Clear bank destination, retained draft and a return state. | You return without authorizing. What happened and what would you do? |
| Says: explains the current state | No direct user quotes collected. | Describe who acts next without decoding system terms. | Named responsible actor and a status tied to an action. | Has the supplier been paid? Who needs to act now? |
| Pain: repeated coordination | Separate funding is in the brief; repeated checking and re-entry remain assumptions. | Distinguish active work from waiting on another person or bank. | Pending task visible in Payments; resume the same request. | Close the task and find where to continue. |
| Gain: accountable completion | Proposed need inferred from the job. | Evidence of the debited account and confirmed outcome. | Payment detail, source, event history and receipt. | Show what proves the supplier payment is complete. |

For each observation I will record role, task, evidence or exact quote, and the decision it changes. For two days, these prompts support a focused walkthrough or a small formative test if participants are available. The map does not invent interviews or feelings.

The business lens is continuity of Accounts Payable: customers can organize and complete eligible supplier work in Clara. Completion and repeat use are candidate outcomes; incorrect source, duplicate payment and missing authorization are guardrails.

## Jobs to be done and decision traceability

**Primary job, inferred from the brief:** When a supplier payment is due and the funds are at another bank, help me prepare the correct request, get the required decisions and resume until I know the outcome, so I can complete the work without rebuilding its context between systems.

**Business job:** Make eligible supplier operations easier to complete and track within Clara's Accounts Payable workflow. Completion and repeat use need a baseline and pilot; the case does not claim measured commercial impact.

| Job fragment | Selected need | Hypothesis | Design artifact | Check |
| --- | --- | --- | --- | --- |
| Use the intended funds | Decide the source in payment context | O1-H1 | Named source account and visible route | Identify the debited account without prompting. |
| Request the right decision | Know the next responsible actor | O1-H2 | Review, approval state and bank handoff | Distinguish company approval, bank authorization and money movement. |
| Resume interrupted work | Keep the request and resolve its state | O1-H3 | List entry, return detail and recovery action | Resume without repeated input or duplicate intent. |
| Confirm the right supplier and amount | Catch a mistake before commitment | O1-H4 | Decision-focused review and field feedback | Detect a planted mismatch and correct it. |

The finance manager is the focal role. Internal and bank authorization responsibilities may be held by different people; I keep the handoff explicit and verify the actual role model before implementation.

## Hypothesis portfolio by opportunity

I keep one selected opportunity, O1, with four falsifiable experience hypotheses. O2 and O3 support its navigation and exception handling; O4 is deferred.

| Opportunity | Hypothesis | Experiment or evidence needed | Scope |
| --- | --- | --- | --- |
| O1 · ready-to-execute payment | H1: a named source with its payment route helps users select and identify the correct debited account without searching another view. | Same payment task; record source mistakes and navigation. Compare A/B as a separate service-feasibility/effort question. | Selected |
| O1 · ready-to-execute payment | H2: an actionable state naming the responsible actor makes the next decision clear without repeated service explanations. | Ask who acts next and whether funds have moved at approval, bank return and completion. | Selected |
| O1 · ready-to-execute payment | H3: a retained request and state-specific actions support resumption without re-entry or duplicate intent. | Close/resume, interrupted authorization and unknown-result tasks. | Selected |
| O1 · ready-to-execute payment | H4: emphasized recipient/amount, adjacent validation and a named source help detect a review mismatch with less rereading. | Compare the current review with a concise version; keep data/path constant and plant one mismatch. | Selected |
| O2 · actionable queue | Showing actor and blocker could help locate the next item requiring action. | Observe current triage and urgency criteria. | Supporting list; prioritization deferred |
| O2 · actionable queue | Distinguishing active work from external waiting could reduce repeated status checking. | Observe follow-up behavior before adding notifications. | Candidate |
| O3 · exception resolution | Supported failure reasons could make the remedy easier to choose. | Map provider reason codes and test comprehension. | One failure in O1 |
| O3 · exception resolution | Correlated event history could reduce uncertainty after a handoff. | Inspect bank-return/status tasks with the same request. | Supporting detail in O1 |
| O4 · repeat work | Reusing confirmed data could reduce repeated setup without source mistakes. | Validate permissions, supplier maintenance and repeat-task behavior. | Deferred |
| O4 · repeat work | Item-level batch results could make partial completion easier to reconcile. | Batch eligibility and partial-result study. | Deferred |

I prioritize H2 and H4 for the two-day experience comparison. H3 is a recovery guardrail, and H1 checks the source decision. My architecture comparison stays conditional on provider support; it does not replace testing the experience I can design.

## Design and engineering contributions

I organized the case around a traceable sequence: brief → product context → observed journey → provisional user understanding → desk research → opportunity → hypotheses → proposed experience. This lets me explain why a screen or interaction belongs in the flow, rather than presenting UI without its reasoning.

For design craft, I established compact typography, proximity rules, a neutral palette, control sizes, radii and restrained surface elevation. I revised component examples and shared patterns against that foundation. The independent DS documentation exposes working examples, source code and a contract so the same decisions can carry from the case hub into the proposal.

For implementation continuity, I built the hub in React and TypeScript, with a public component API, a token/component registry and generated manifests. Build checks cover generated artifacts, registered components, selected import boundaries and token rules. The repository includes a reproducible npm build and CI verification. These checks support consistency; they do not establish complete accessibility or product-flow validation.

The trade-off is deliberate: I am using a local reusable foundation to prototype and review the experience within two days. I have not built a financial backend, connected real bank APIs, validated an initiator partnership or executed a payment. Those boundaries keep the prototype reviewable without overstating feasibility.

My work is visible in the framing, scope decisions, research synthesis, interface critique, component rules and review of AI output. The AI work log records what was assisted and what remains unverified. User validation and business results will be added only when they exist.

## Prototype implementation and comparison

I built an interactive proposed workspace with its own sidebar and header, connecting Overview, Payments, Approvals, Accounts and Activity. The selected opportunity remains O1: using external funds within the payment context. The surrounding views expose the source, responsible actor and payment outcome rather than placing the feature in an isolated form.

Path A pays the supplier directly from the external account. Path B first funds Clara and then releases a supplier payment. I am exploring A as the initial design direction because it removes the separate funding task in the brief; eligibility and initiator capability remain assumptions to confirm. Both paths can be exercised in the prototype before I consolidate that decision.

The first connection is separate from payment authorization. A request goes through one illustrative company approval before a bank-authorized representative confirms the transaction in a simulated bank handoff. On return, the draft and approval remain available. A confirmed top-up is labeled independently from a supplier payment.

The prototype includes beneficiary lookup against a fictional fixture, amount validation, review, company approval, bank authorization, processing, confirmed failure, unknown outcome and a final receipt example. Test controls select the next response. Unknown outcomes only allow querying the same payment intent; a confirmed second-leg failure on Path B preserves the completed top-up instead of repeating it.

| Hypothesis | Implemented surface | Available evidence |
| --- | --- | --- |
| O1-H1 | Both money paths and their separate movement summaries | Prototype task comparison; active time still requires a user test record |
| O1-H2 | Review, company approval, bank handoff and next-actor copy | Explain each stage and debited account during a walkthrough |
| O1-H3 | Authorization cancellation, confirmed failure and unknown-outcome recovery | Interaction log plus tests of state transitions and duplicate-send guards |
| O1-H4 | Grouped source, recipient, amount and related action using the DS | Visual and comprehension review; user observations still to collect |

The local log records prototype events and can be exported from Test controls. It is not a user-validation result. Automated tests cover review prerequisites, approval gating, cancellation recovery, direct confirmation, top-up versus supplier settlement, unknown-result guards and stale responses. Bank and payment responses are simulated; production duplicate prevention still requires a backend contract.
