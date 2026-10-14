# Clara — initial analysis of the brief and current payment flow

For this Design Engineer case in Product Finance, I started with the brief and available references to understand the operation before defining a solution. The challenge is to let a finance team pay suppliers through Clara using funds held at another bank while preserving approvals and traceability. The brief defines Open Finance payment initiation as the opportunity. My hypotheses concern the experience of completing that task, alongside existing approval and tracking controls.

Research consolidated on October 13, 2026. **Demo** identifies my screenshots; **official documentation** identifies Clara's public materials; **hypothesis** identifies design interpretation; **reconstruction** identifies diagrams of uncaptured states. Transaction dates do not establish the UI version.

## Brief and evaluation criteria

The brief describes a finance manager at a Brazilian company with 200 employees, accounts at two traditional banks and dozens of supplier payments each week. The manager currently needs to open the bank, transfer money to Clara, return to Clara and only then pay.

The evaluation asks for problem framing and a metric, Pix and Open Finance context, first connection and consent, a payment and at least one failure scenario in high fidelity. It also asks for explored alternatives, reused components, a design system contribution and a record of AI use, including mistakes and time spent. The presentation allows approximately 30 minutes for the walkthrough and 15 for discussion.

Source: the private brief I received during the interview process. These requirements describe the evaluation; this document records my initial analysis.

## Product context and the brief

### What Clara brings together

Clara positions its platform around company spending: corporate cards, expense control, supplier payments and a digital account. The value proposition connects transactions with the information and controls needed to manage them. Its Brazilian product pages also promote payment automation, ERP integration and cash-management options. These are public product claims, not results measured in this case. Sources reviewed October 14, 2026: [Clara product overview](https://www.clara.com/pt-br) and [Accounts Payable](https://www.clara.com/pt-br/produtos/contas-a-pagar).

### The work behind the product

| Financial job | Product context | What matters for this case |
| --- | --- | --- |
| Organize company spending | Cards and expense records connect transactions to business context. | A supplier payment belongs to a wider financial routine. |
| Decide what can be paid | Requests and configured approval rules structure company decisions. | Speed must preserve authority and review quality. |
| Execute and follow the money | Payments and the digital account support money movement and its records. | The source, outcome and next action must remain understandable. |
| Close the operational loop | Records and integrations support financial follow-up. | A visible success state must correspond to a traceable outcome. |

> **My reading:** Clara's relevance depends on how these jobs connect. A payment interface has to support the decision before sending and the explanation afterwards. Making the screen cleaner is useful only when it helps that work.

### Positioning and ambition

The public portfolio places Clara beyond an isolated payment screen: cards, controls, payments and account services share the same financial workspace. I read this as an ambition to support more of the company's spending routine. The breadth of the offer establishes the positioning; it does not reveal the internal roadmap or explain which historical decisions produced it.

There is a business tension worth investigating: the product promotes account usage and cash-management services, while the brief describes a customer whose funds remain at other banks. Serving that routine could matter for payment usage, but I do not yet know the economics, eligibility or effect on account balances. I would need internal evidence before treating any of these as a business result.

### How the brief connects

The brief places a finance manager in a Brazilian company with 200 employees, two traditional banks and dozens of weekly supplier payments. Funding Clara before paying introduces a preparatory task outside the payment workspace. This is the stated problem to investigate, not a measured abandonment rate. The company size describes the operating context, not 200 payment users.

The case asks me to consider Pix and Open Finance, first connection and consent, a payment and a failure, alongside alternatives and a reusable design contribution. I will use those requirements to examine the existing journey. The questions at this stage are where work is interrupted, which controls already help, and what evidence is needed to assess a change.

> **My reading:** the product context sets the evaluation criteria: operational effort, control, continuity and traceability. The audit and benchmark should explain where intervention is justified before I choose an opportunity.

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

## Critical audit of the current experience

I reviewed the supplied demo screens and the official flow references in this document. This is a heuristic audit, not an observed usability study. I distinguish a problem stated in the brief, a risk visible in the interface and a state I have not captured. Priority here means relevance to the brief and possible consequence, not measured frequency or a numerical severity score. Each crop isolates the area I am discussing; select it to inspect the original full screenshot.

### A1 · Before paying, the account needs to be funded

**From the brief:** the company holds funds at two traditional banks. To pay suppliers through Clara, the manager first transfers funds into the Clara account.

![A1 · Flow reconstructed from the brief: external bank → transfer to Clara → funds available in Clara → pay the supplier. “Funds available” represents a necessary condition, not an observed confirmation screen.](assets/a1-funding-flow.svg)

The diagram makes the dependency described in the brief visible. It does not document the external bank's screens, transfer time or the way the manager confirms that the funds arrived.

> **My reading · A1:** paying a supplier includes preparatory work before the payment itself. I want to understand how the manager coordinates that preparation and keeps track of the intended payment when moving between the bank and Clara. The extra step is explicit in the brief; its impact on effort, errors or abandonment still needs investigation.

**Question to investigate:** how much work does funding add, and what information does the manager need to resume the payment confidently once the money is available?

**Benchmark cross-check:** Mercury makes account identity visible in request and review; Wise distinguishes funding from transfer progress. These references help me investigate source clarity and continuity. They do not establish which external-bank capabilities Clara can offer.

> **Hypothesis to test · A1:** keeping the payment context and funding state understandable throughout preparation may help the manager resume the task with less reorientation. I would compare correct completion and active handling time, including funding preparation. This informs H1; it does not yet select a payment route or assume that Clara can remove bank authorization.

### A2 · Outcome labels carry more meaning than their shared color

**Evidence — Payments demo:** Paid and Reversed have green badges. Their text is different. The screen already provides statuses, search and receipt access.

![A2 · Paid and Reversed use green badges in Payments. Compare the outcome words, not just their color.](assets/06-pagamentos.png#crop=820,343,440,382&size=1676,1030)

**My assessment:** a quick scan by color may group a completed payment with a returned one. That is a visibility risk, not proof that people confuse them or that the screen fails accessibility. I would retain explicit labels and test how people interpret the outcomes.

**Benchmark cross-check:** Nubank's tutorial and Cora's historical animation pair an explicit result with amount, recipient and receipt access. Mercury instead confirms a request was created. The contrast is useful: completing a request and completing a transfer are different outcomes.

> **Hypothesis to test · A2:** distinct textual outcomes, supported by consistent semantic treatment and transaction detail, may help a person explain whether money moved and what to do next. This informs H2/H3; a new color palette alone would not establish the gain.

### A3 · A queue supports action, but decision context still needs inspection

**Evidence — Tasks demo and approval guide:** the queue exposes requester, amount, waiting time and an Approve action. The guide describes reviewing payment details and configured approvers. The individual approval detail is not captured.

![A3 · Tasks: waiting time, amount and Approve actions. This queue does not show what happens after opening a request.](assets/03-tarefas.png#crop=755,238,900,250&size=1676,1030)

**My assessment:** the queue makes pending work visible, which I would preserve. Repeated overdue labels may offer limited prioritization, but I cannot conclude that urgency rules are missing. Nor can I infer that the visible Approve action bypasses review.

**Benchmark cross-check:** Ramp exposes next-approver filtering; Conta Simples documents decision reasons and who acted and when. These support questions about responsibility and decision quality, rather than a justification for replacing Clara's approval engine.

> **Hypothesis to test · A3:** a clear next actor and a concise decision summary may reduce uncertainty about who acts and whether approval releases funds. This informs H2 within the payment flow required by the brief. I would first inspect the existing detail and ask a participant to explain the pending state.

### A4 · Existing validation is a foundation to preserve

**Evidence — official entry/error frames:** the form groups financial information and supporting documents; an invalid key has adjacent error text and prevents review.

![A4 · Existing validation: adjacent invalid-key feedback and a disabled Review action. Official demonstration frame.](assets/09-frame-118.png#crop=565,25,565,600&size=1152,648)

**My assessment:** this already supports error prevention. The missing evidence is what happens after a valid lookup and how recipient identity, amount and source appear in review. Missing screenshots are not missing product features.

**Benchmark cross-check:** Mercury groups required and optional fields and shows local upload progress. Nubank exposes interpreted recipient details before the Pix action. Cora separates review from transaction authentication, although its visual reference is historical.

> **Hypothesis to test · A4:** adjacent feedback and a review hierarchy emphasizing recipient, amount and source may help people detect a mismatch without rereading explanatory blocks. This informs H4. I would keep Clara's existing validation behavior and measure errors caught, not simply clicks removed.

### A5 · Failure labels do not establish the recovery experience

**Evidence — Payments demo and official status documentation:** failure and processing states exist. A failure-detail screen and the uncertain-outcome recovery path have not been captured.

![A5 · Failed payment in the demo list. The visible status establishes the outcome label, not the recovery behavior.](assets/06-pagamentos.png#crop=820,944,620,81&size=1676,1030)

**My assessment:** I cannot claim Clara loses context or encourages duplicates. I can identify a consequential question: how does someone distinguish a definitive failure from an outcome that has not yet been confirmed?

**Benchmark cross-check:** Ramp documents reasons and available actions; Wise distinguishes funding and transfer milestones. Neither provides a direct visual precedent for every Pix failure in this case.

> **Hypothesis to test · A5:** preserving the request and offering a state-specific next action may support recovery without repeated entry or duplicate intent. This informs H3 within the same payment flow. Unknown outcomes need status verification before a new submission can be considered safe.

### A6 · Dense information needs hierarchy, not a cosmetic reset

**Evidence — supplied Summary, Tasks and Payments screens:** several summaries, statuses and actions compete within broad tables; some actions are icon-only. The Summary capture also shows horizontal overflow. Capture size and demo data may affect that layout.

![A6 · Summary: horizontal overflow and truncated table values in this capture. Responsive behavior still needs testing.](assets/01-resumo.png#crop=160,810,1490,215&size=1676,1030)

**My assessment:** these are reasons to check scanning, responsive layout and action recognition. They do not establish insufficient contrast, absent tooltips, keyboard failure or poor real-world performance. I have not tested those behaviors in the authenticated product.

**Benchmark cross-check:** Ramp uses restrained list hierarchy and Mercury groups task fields. I would borrow their grouping principles while retaining familiar payment vocabulary and the existing company's controls.

> **My reading · A6:** the DS can make spacing, text roles, status treatment and interaction states predictable across my proposal. It cannot fix a funding dependency or make an unclear process understandable by itself. My visual direction is a case design choice; its value must be demonstrated through task comprehension and consistency.

### From audit to the brief's experience hypotheses

| Audit | Design responsibility | Hypothesis |
| --- | --- | --- |
| A1 | Replace the separate manual top-up task with understandable external-source payment initiation. | H1 · source and continuity |
| A3 / A2 | Preserve company policy and clarify each action's consequence. | H2 · commitment |
| A4 / A6 | Preserve validation and make payment review easy to check and correct. | H4 · review |
| A5 / A2 | Explain outcomes and retain the request for safe recovery. | H3 · recovery |

The benchmark informs interaction mechanisms for these hypotheses. All four belong to the single opportunity defined by the brief.

## Audit-driven interface decisions

| Finding | Design commitment | Shared API / contract | Validation before claiming improvement |
| --- | --- | --- | --- |
| A2 · status meaning | Separate request, approval, processing, reversal and settlement in words; color is supporting information. | PaymentStatus, Badge, Timeline; visibility and semantic consistency | Ask whether funds moved and who acts next at each state. |
| A3 · decision context | Keep amount, recipient and responsible actor near the decision; preserve company approval rules. | ReviewSummary, Button; recognition and error prevention | Correct interpretation of actor and consequence; no bypass of approval. |
| A4 · validation | Keep labels, adjacent errors and entered values; distinguish lookup feedback from payment outcome. | Field, InputGroup, Alert, Button loading; prevention and feedback | Keyboard completion, error association, mismatch detection and retained data. |
| A5 · uncertain outcome | Preserve request identity; verify its status before offering resubmission. | PaymentStatus, Timeline, Alert; recovery contract plus service state model | No duplicate intent in uncertain-result scenarios; backend idempotency remains required. |
| A6 · hierarchy | Use semantic headings, smaller gaps within groups and consistent action placement. | PageHeader, Stack, Inline; proximity and type roles | Check scanning at the target viewport and 200% zoom; compare task comprehension. |
| A6 · recognition | Give icon-only actions accessible names and discoverable explanations; use visible labels for consequential choices. | Button, Tooltip; recognition and focus rules | Keyboard focus order, visible focus and accessible names; do not treat a tooltip as the only label. |

> **My reading:** the justification for the DS is repeatable behavior and understandable hierarchy. Nunito Sans, compact dimensions and radii express my visual direction; they are not evidence that Clara's typography or styling is wrong. Build and registry checks establish implementation consistency, while task testing and accessibility checks establish whether that consistency helps people.

## Payments as the entry point

**Demo screenshot.** The screen brings together Balance, Processing and Pending approval; Overview, Pending approval and Scheduled tabs; beneficiary search, filters and receipt download. Each row shows request date, beneficiary, document, amount, method, status and attachment.

The screenshot includes Pending, Paid, Reversed, Rejected and Failed. Paid and Reversed share the same green: the text distinguishes the outcome, but color does not distinguish settlement from a return. The monetary approval summary and tab count represent different measures, so the screenshot alone cannot establish an inconsistency.

> **Hypothesis to test:** starting the new flow from New payment could preserve accounts-payable context. The funding account would also need to appear in review and detail, so both requester and approver know where the funds will come from. The current screenshot has no bank-source column.

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

> **My reading for the proposal:** an external-bank debit needs visible confirmation and source traceability. The Clara statement alone does not represent that debit. The list should distinguish internal approval, bank authorization, processing and final outcome.

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
3. Keep the brief-defined external-bank-to-supplier route fixed and compare interaction alternatives within it.
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

On October 14, I requested an Astra review of the opportunity tree and hypotheses. The review identified an overly broad selected opportunity, subordinate alternatives, a misleading current-review comparison and overly broad resumption claims. I narrowed the tree to three needs, separated user-task continuity from money movements, kept recovery as a guardrail and changed the primary experience measure to active handling time. These are review decisions, not user-validation findings; this pass was not separately timed. I subsequently corrected that framing against the explicit brief: the opportunity and external-payment service were already defined. The active case now tests H1–H4 within that opportunity; the earlier three-branch tree and top-up alternative were removed.

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

> **My reading:** optional content sits after the required decision fields, with navigation at the end of the form. For H4, I will keep supporting information secondary to recipient, amount and source. Attachments remain outside the core experiment.

![Mercury — upload in progress with filename, progress and cancel control. Supplied Mobbin capture.](assets/benchmark/mercury-upload-progress.png)

![Mercury — completed upload preserves the filename and changes the status indicator. Supplied Mobbin capture.](assets/benchmark/mercury-upload-complete.png)

> **My reading:** feedback changes beside the object being processed, without replacing the task. I will apply that principle to recipient lookup and service responses: retain context, announce the state and prevent repeated submission. An upload completion check is not evidence that a financial transaction completed.

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

> **My reading:** a task can return to a recognizable queue. For H2/H3, closing the guided payment should leave a findable request with its current state. Saved custom views are a future reference, not part of this two-day scope.

![Ramp — applied status filters and a menu including Next approver. Official help-center image.](assets/benchmark/ramp-filters.png)

> **My reading:** status and responsibility can help locate work without rereading every row. I will test a named next actor in the payment detail before considering advanced filters.

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

The opportunity is fixed by the brief. H1–H4 test mechanisms within that experience.

| ID | Refined hypothesis | Controlled comparison | What I observe | Evidence that challenges it |
| --- | --- | --- | --- | --- |
| H1 · source decision | A named source with its route supports the correct funding decision without searching another view. | Same supplier and amount with named source versus the previous summary. Keep the payment path constant; compare A/B separately as service alternatives. | Completion, active time, switching and identified debited account. | Source confusion or unnecessary navigation. Service eligibility is assessed separately. |
| H2 · next action | A concise status naming the responsible actor and action lets the person distinguish company approval, bank authorization and payment completion. | At the same service state, compare the earlier explanation-heavy prototype with a concise actor/action version. | Ask who acts next and whether funds have moved; record unprompted answers. | Approval is still interpreted as payment, or the next actor remains unclear. |
| H3 · recovery | A retained request with distinct actions for definitive failure and uncertain outcome supports resumption without repeated entry or duplicate intent. | Use separate interruption and unknown-outcome tasks. Preserve the same transaction data. | Re-entered fields, chosen recovery action and intention to submit again. | Lost context, unsafe retry or an unclear current state. |
| H4 · decision clarity | Emphasized amount and verified recipient, a named source account and adjacent field feedback help detect a planted review mismatch with less rereading than repeated explanatory alerts. | Compare the earlier prototype review with a compact decision-focused version; keep the service path and data constant. Include one intentionally incorrect amount or recipient in the test task. | Whether the mismatch is caught before requesting approval, details identified and rereading/hesitation. | More missed mismatches or faster completion caused by skipping review. |

In two days H1 tests the funding decision, H2 the meaning of commitment and H4 review correctness; H3 is a required recovery check; initiation eligibility is a separate implementation dependency. If sessions are unavailable, I report a heuristic evaluation and an experiment plan, not validated hypotheses. I use formative observations rather than inventing targets such as a 30% improvement.

Sources: [Mercury payment-link guide](https://support.mercury.com/hc/en-us/articles/44220096132116-How-to-create-and-send-a-payment-link-in-Mercury), [Nubank Pix guidance](https://blog.nubank.com.br/pix-tudo-sobre/), [Wise sending guide](https://wise.com/help/articles/2977959/how-do-i-send-money-with-wise), [Wise tracker](https://wise.com/help/articles/2452305/how-do-i-check-my-transfers-status), [Wise Platform status semantics](https://docs.wise.com/guides/product/send-money/tracking/transfer-statuses).

## Opportunity defined by the brief

The brief sets the opportunity:

> **Brief:** “Design how Clara could use Open Finance payment initiation so that a finance team can pay via Pix from Clara using the balance they hold at another bank, without leaving the flow.”

My task is to design and test how this works for the finance team. The money route is **external bank → supplier**, initiated from the Clara experience. Prefunding Clara describes the current friction; it is not an alternative solution to this brief.

### My design scope within that opportunity

I focus on one supplier payment: first-use account preparation and consent, source selection, recipient validation, review, the required approvals and authorization, result tracking and recovery. This bounded journey covers the brief and lets me demonstrate the connection between product reasoning, interaction, accessible UI, service states and implementation.

“Without leaving the flow” is the experience requirement: preserve the payment intent, entered information and next action throughout. The authorization mechanism and any bank handoff must be verified with the initiation provider. A redirected journey would need to preserve continuity on return and be checked against the expected interpretation of the brief; it is not a promise of a fully embedded bank experience.

### How my audit informs the hypotheses

| Audit evidence | Experience question within the brief | Hypothesis |
| --- | --- | --- |
| A1 · Funding preparation comes before payment today | Can the person use the intended external balance as part of one payment task, without a manual Clara top-up? | H1 · source and task continuity |
| A3 · Company approvals already exist; A2 · result words matter | Does the person understand connection, company approval, bank authorization and payment completion? | H2 · meaning of commitment |
| A4 · Existing inline validation works; A6 · hierarchy needs evaluation | Can the person catch a wrong recipient, amount or source before commitment? | H4 · review correctness |
| A5 · Recovery detail is unobserved; A2 · outcomes differ | Can the person resume an interruption and act safely when the outcome is unknown? | H3 · recovery and state comprehension |

Approvals and recovery are requirements of this same experience. The audit identifies what to preserve, investigate and test; it does not create competing opportunities or prove usability failures.

### Alternatives I will explore

| Interaction decision | Variants within the same payment service | Evidence to decide |
| --- | --- | --- |
| Task structure | Compact grouped form versus guided steps | Correct completion, active effort, reorientation and assistance. |
| Source preparation | Payment context visible before first connection versus source preparation first | Understanding of purpose, retained context and correct source identification. |
| Review hierarchy | Compact summary versus grouped recipient / amount / source with adjacent editing | Mismatches detected, omissions and correction effort. |
| Feedback and return | Concise next-action guidance and visible retained context | Correct next actor, understanding of outcome and safe recovery. |

Keep recipient, amount, bank, approval policy and money route equivalent in comparisons. First use, repeat use, failure and unknown outcomes are scenarios of the same service, not separate paths for moving money.

> **My decision:** the opportunity comes from the brief. My contribution is to turn it into a coherent payment experience, justify the interaction choices with the audit and benchmark, and test whether people understand and can complete the task. Feasibility dependencies remain explicit rather than being replaced by a different funding proposal.

### Service boundaries

Clara can organize preparation, review, company controls and tracking. Initiator eligibility, supported business accounts, consent, bank signatories, authorization, status reconciliation and idempotency require provider validation. I can test comprehension in the wireflow; a successful walkthrough does not establish production readiness.

## Experiment plan for the brief-defined experience

These are planned formative checks. The two-day goal is a reviewable interaction proposal with recorded issues and decisions. I will report participant roles, actual count, tasks and limitations when sessions occur. If recruitment is unavailable, I will record an expert walkthrough and leave the user hypotheses open.

### A bounded test sequence

| Task | Observe before asking follow-up questions | Hypothesis and decision |
| --- | --- | --- |
| Prepare one supplier payment using Bank A, with Bank B also available. | Source choice, extra navigation, repeated information and active time. Then ask which account will be debited and what happens to the funds. | H1: revise if source or route is misunderstood. |
| Review a request containing one mismatch against the task information. | Whether the mismatch is caught and corrected before commitment; do not tell the person where it is. | H4: compare equivalent proposal variants; reverse order where feasible to reduce learning effects. |
| Request the required decision and continue toward bank authorization. | Whether the action's consequence is understood. Then ask who acts next and whether the supplier is paid. | H2: revise confident misinterpretations of permission or settlement. |
| Return after interrupted authorization; separately inspect an unknown result. | State interpretation, fields re-entered, chosen recovery action and attempted new submission. | H3: any unsafe retry or loss of required context blocks consolidation. |

I will keep data, service path and approval policy equivalent when comparing UI variants. The external-bank-to-supplier route stays fixed; alternatives concern interaction and information hierarchy. A demonstration of a simulated bank cannot measure real bank waiting or authentication effort.

### Metrics and decision rules

**Primary experience measure:** active handling time for an equivalent, correctly completed task. Start when work on the intended payment begins, include preparatory funding and retries, and record passive waiting separately. Report individual observations and, when useful, the median; show failed and abandoned tasks alongside successful ones so a faster average cannot hide failures. A comparison with the existing operation requires observing it or explicitly labeling a reconstruction.

**Comprehension and safety checks:** correct source, detected mismatch, understood commitment, correct next actor, and safe recovery. Record assistance and unnecessary navigation. A confident wrong-source or approval-as-settlement interpretation, unsafe repeat submission or inaccessible essential action is a critical issue to revise and recheck. Fewer clicks or faster completion do not compensate for these errors.

**Later business metric:** unique eligible payment intents reaching authoritative supplier settlement divided by unique eligible intents started, within a defined observation window. Define eligibility before counting; retries remain the same intent. Segment first use versus repeat use and eligible source institutions. Track active effort, end-to-end elapsed time, support demand and duplicate payments separately. I have no baseline for a numeric uplift target.

The current prototype covers a fictional account and supplier. Its interaction log records events, not measured user comprehension or production settlement. Same-session close/resume is implemented; refresh and cross-device draft recovery remain engineering work. A pilot would require persistent request identity, authorization checks, status reconciliation and backend idempotency.

## Proposed journey: one payment task, explicit service boundaries

**Design intent:** start and track the supplier payment in Clara using money held at an eligible external bank. “No prefunding in Clara” does not mean “no funds required”: the source bank must be able to execute the payment. My proposal preserves the task across any required bank handoff.

![Proposed journey · Direct payment specified by the brief. Company approval and bank authorization remain separate; the bank experience is outside this proposal.](assets/proposed-payment-journey.svg)

### Where Open Finance fits

Payment initiation is the relevant Open Finance service: an initiator starts a payment debited at another institution. This is distinct from sharing balance or account data. A connection or permission to access data is not blanket payment authorization. The public framework supports this service concept; it does not establish Clara's eligibility, partner arrangement or support for these business accounts. [BCB: participant roles](https://www.bcb.gov.br/meubc/faqs/p/funcoes-das-instituicoes-participantes-do-open-finance), [BCB: Open Finance services and consent](https://www.bcb.gov.br/meubc/faqs/s/open-finance).

For this exploration I assume a redirect to the account-holding bank when authorization is required. A no-redirection journey has its own account-linking and transaction requirements; it is not a shortcut I can claim by changing the UI. Business-account representation and any required bank signatories must be checked with the provider. [BCB: no-redirection framework, Instruction 759](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=759&tipo=Instru%C3%A7%C3%A3o+Normativa+BCB).

### Journey to walk through before high fidelity

| Moment and actor | Proposed experience in Clara | Service boundary / state | Audit and test |
| --- | --- | --- | --- |
| 1 · Requester starts | Start New payment, identify recipient and amount; choose the intended source without a separate funding errand. | Recipient validation and eligible source data must be available. Keep the draft if preparation is interrupted. | A1/A4 → H1/H4: correct source and recipient. |
| 2 · Requester prepares an external source | Explain the purpose and identify the bank/account. Show connection preparation only when needed; retain payment details on return. | Provider-specific connection, consent and payment initiation are separate concerns. No credentials collected in Clara; no promise of a live balance without the relevant data access. | A1/A6 → H1/H2: why the handoff occurs and what it permits. |
| 3 · Requester reviews | Group recipient, amount, debit account and direct money route; allow edits before requesting the required decision. | Material changes invalidate the previous review and may require new company approval or consent. | A4/A6 → H4: detect and correct a planted mismatch. |
| 4 · Company approver decides | Preserve configured approval policy; show who acts next and whether the request is ready for bank authorization. | Internal approval does not establish bank authorization or settlement. Ordering and consent lifetime require integration validation. | A3 → H2: explain the action and next actor. |
| 5 · Authorized bank representative authorizes | Name the destination and preserve a resumable request. On return, show the authoritative state. | Authentication, transaction authorization and bank signatories are controlled by the bank. A return URL is not proof of payment. | A1/A3/A5 → H2/H3: resume without assuming payment succeeded. |
| 6 · Requester tracks the outcome | Distinguish processing, paid, definitive failure and unknown outcome. Show a receipt only after confirmed settlement; recovery preserves the request. | Check the same payment when unknown. Offer a retry only when the prior outcome and provider rules make it safe, with renewed approvals/authorization where required. | A2/A5 → H3: correct outcome and safe next action. |

### One money route

**External bank → supplier.** Clara initiates and tracks the payment through the proposed Open Finance experience. There is no prefunding leg into Clara. The source still needs sufficient available funds and valid authorization.

> **My reading:** the brief defines the service direction. My design must preserve task continuity and make the debit source, permissions and outcome understandable. If a required capability is unavailable, I should surface that feasibility constraint rather than substitute a top-up and claim to have met the brief.

### What the wireflow can establish

**Iteration boundary:** the existing clickable wireflow starts with source connection, then asks for payment details. The journey above proposes starting from the payment intent and revealing source preparation in context. I will use that order as the next comparison, not describe the current wireflow as an implementation of every proposed step. Repeat-use connection skipping also needs an explicit variant. Approval, bank return, failure and unknown-result branches already provide a basis for the checks below.

Walk through first use, a repeat payment with an already prepared source, interrupted authorization, and an unknown result. Record source comprehension, mismatch detection, the next actor, unnecessary re-entry and unsafe retries. Compare the earlier interaction with the revised one using the same task and route. Keep bank behavior as an explicit boundary, not a designed substitute for the bank's real screens.

The wireflow tests whether people understand and can navigate the proposal. It cannot establish real bank compatibility, legal readiness, transfer timing or production settlement. Before high fidelity, resolve critical comprehension and recovery problems; before implementation, verify provider/PJ support, approval ordering, consent expiry, status reconciliation and idempotency. All sessions and outcomes are still to be recorded.

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
| Day 1 — frame and decide | Finish this bounded desk research; map experience hypotheses; identify PJ dependencies; compare interaction structures | Brief-defined opportunity, hypotheses, journey and state map |
| Day 1 — build | Reuse the DS for first connection, payment entry and review | A compact high-fidelity happy path |
| Day 2 — recovery and checks | Add authorization interruption, processing and unknown outcome; run available usability or heuristic checks | Clickable prototype, issues and explicit limitations |
| Day 2 — prepare the walkthrough | Refine hierarchy and copy; document alternatives, DS contribution and AI use; rehearse | A 30-minute walkthrough with 15 minutes for discussion |

Friday's presentation should make my judgment visible: what I observed, why I selected this opportunity, how the flow protects approvals and authorization, what I learned from checks and what still depends on implementation validation. I will prioritize one coherent experience over an expanded feature set.

## Discovery: empathy map and user voice

I focus on the finance manager in the brief: a company with 200 employees, two traditional banks and dozens of supplier payments each week. The employee count describes the organization; it does not establish 200 payment users. Requester, company approver and bank-authorized representative are responsibilities whose overlap remains unknown.

My working scenario is a supplier payment with funds at another bank. I add a company decision and an interrupted authorization as test conditions, rather than observed details of a particular customer's routine.

| Empathy lens | Established evidence | Working need and neutral discovery prompt | Decision it informs |
| --- | --- | --- | --- |
| Does | The brief describes opening the bank, funding Clara, returning and paying. | What information is repeated or kept elsewhere? “Walk me through the last payment like this.” | H1: preserve the source decision in the payment task. |
| Thinks | Payment details and company approval rules are documented. | Which details determine readiness? “What do you check before continuing, and why?” | H1/H4: source identity, recipient, amount and review hierarchy. |
| Feels | No emotional evidence has been collected. | An interruption may introduce uncertainty. “What information would you need to decide what to do next?” | H3: authoritative outcome and a valid recovery action. |
| Says | No interview quotes have been collected. | “What happened here?” “What would you tell the supplier?” | H2: distinguish a created request, authorization and settlement. |
| Pain | Separate funding is explicit; chasing approvers and repeated checking are unverified. | “Where do you spend time doing something, and where are you waiting?” | Identify where active effort and waiting occur within the payment task required by the brief. |
| Gain | The task requires paying the supplier with the necessary controls. | “What tells you this work is finished?” | Confirmed outcome and retrievable evidence; verify whether these resolve the user's task. |

The map is provisional. I will record exact observations, role, task and the design decision they change. I will not turn assumed feelings into quotations or treat competitor behavior as a user interview.

For Clara, the candidate value is easier completion of eligible supplier operations in Accounts Payable. The current evidence supports investigating effort reduction; adoption, repeat use and completion uplift require customer and production evidence. Safe authorization, correct source and no duplicate payment remain guardrails.

## Jobs to be done and decision traceability

**Primary job, inferred from the brief:** When I need to pay a supplier and the funds are at another bank, help me use the intended account within the payment task, so I can complete the work without organizing funding separately. Required company decisions, bank authorization and recovery constrain how I deliver this job.

**Business job:** Make eligible supplier operations easier to complete and track within Clara's Accounts Payable workflow. Completion and repeat use need a baseline and pilot; the case does not claim measured commercial impact.

| Job fragment | Selected need | Hypothesis | Design artifact | Check |
| --- | --- | --- | --- | --- |
| Use the intended funds | Decide the source in payment context | H1 | Named source account and visible route | Identify the debited account without prompting. |
| Request the right decision | Understand what the next action commits to | H2 | Review, approval state and bank handoff | Distinguish company approval, bank authorization and money movement. |
| Resume interrupted work | Keep the request and resolve its state | H3 | List entry, return detail and recovery action | Resume without repeated input or duplicate intent. |
| Confirm the right supplier and amount | Catch a mistake before commitment | H4 | Decision-focused review and field feedback | Detect a planted mismatch and correct it. |

The finance manager is the focal role. Internal and bank authorization responsibilities may be held by different people; I keep the handoff explicit and verify the actual role model before implementation.

## Experience hypotheses for the brief

The brief defines one opportunity. H1, H2, H4 and H3 test source continuity, commitment, review and recovery within it. All are required dimensions of the proposed payment experience.

| ID and mechanism | Falsifiable hypothesis | Test and evidence that would challenge it |
| --- | --- | --- |
| **H1 · source decision** | A named bank/account and explicit route in payment context let the person select and identify the intended source without opening another view. | Assign Bank A while Bank B is available. Observe selection, then ask what will be debited. Wrong source, belief that Clara needs a top-up or navigation needed to identify the account challenge the design. |
| **H2 · meaning of commitment** | Concise action/consequence wording at review and bank handoff lets the person distinguish requesting company approval, authorizing a transaction and confirming supplier payment. | At commitment boundaries, ask what the action permits and whether money has moved. Connection interpreted as unrestricted permission, or approval interpreted as payment, requires revision. |
| **H4 · review correctness** | Grouping recipient, amount and funding source around the decision helps the person catch an incorrect value before submission without increasing omissions elsewhere. | Compare two proposal variants with equivalent tasks and one planted mismatch each; vary order and mismatch location. More missed errors, or speed gained by skipping review, challenges the hypothesis. |
| **H3 · recovery guardrail** | Retaining the request and offering state-valid actions supports resumption without unnecessary re-entry or a second submission while the result is unknown. | Separately interrupt authorization and return an unknown execution result. Observe the state explanation and next action. Lost context or duplicate intent blocks consolidation. Closing/reopening currently retains data only in the same session. |

### Trace each hypothesis to evidence and a wireflow moment

| Hypothesis | Audit origin | Benchmark mechanism to examine | Wireflow moment |
| --- | --- | --- | --- |
| H1 | A1: separate funding task; A6: recognizable information | Mercury account identity; Wise funding semantics | Source choice and return from source preparation. |
| H2 | A3: approval policy; A2: distinct outcomes | Cora review/authentication separation; Mercury request-created vs Nubank payment-result | Review, company decision, bank handoff and result. |
| H4 | A4: existing inline validation; A6: hierarchy | Mercury field grouping; Nubank recipient review | Beneficiary lookup and pre-submission mismatch check. |
| H3 | A5: unobserved recovery; A2: outcome meaning | Ramp reasons/actions; Wise milestones | Interrupted authorization and unknown result. |

These are evidence-linked design hypotheses, not established user pain or validated benchmark outcomes. A6 contributes shared hierarchy and accessibility criteria to every branch, within the brief-defined experience.

H2 includes the necessary approval and authorization handoffs; H3 includes interruption, definitive failure and an unknown result. They remain within the same supplier-payment task.

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

The flow covers source selection, first connection, recipient lookup, amount, review, company approval, bank handoff and outcome. I can close and reopen the same request in the current session, return before authorization, and choose confirmed success, confirmed failure or an unknown result. The active wireflow uses direct external payment. An unknown result exposes status checking instead of a new submission.

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

I built an interactive proposed workspace with its own sidebar and header, connecting Overview, Payments, Approvals, Accounts and Activity. The opportunity is defined by the brief: initiate a Pix from Clara using funds at another bank. This first iteration predates the refined test plan; it is not evidence that the hypotheses have been validated. The surrounding views expose the source, responsible actor and payment outcome rather than placing the feature in an isolated form.

The active prototype follows the brief: external account → supplier, initiated from Clara. Eligibility and initiator capability remain implementation dependencies. Earlier top-up exploration has been removed from the case navigation and trial controls.

The first connection is separate from payment authorization. A request goes through one illustrative company approval before a bank-authorized representative confirms the transaction in a simulated bank handoff. On return, the draft and approval remain available.

The prototype includes beneficiary lookup against a fictional fixture, amount validation, review, company approval, bank authorization, processing, confirmed failure, unknown outcome and a final receipt example. Test controls select the next response. Unknown outcomes only allow querying the same payment intent.

| Hypothesis | Implemented surface | Available evidence |
| --- | --- | --- |
| H1 | Named source and route; both money paths are service alternatives | Prototype task comparison; active time still requires a user test record |
| H2 | Review, company approval, bank handoff and next-actor copy | Explain each stage and debited account during a walkthrough |
| H3 | Authorization cancellation, confirmed failure and unknown-outcome recovery | Interaction log plus tests of state transitions and duplicate-send guards |
| H4 | Grouped source, recipient, amount and related action using the DS | Visual and comprehension review; user observations still to collect |

The local log records prototype events and can be exported from Test controls. It is not a user-validation result. Automated tests cover review prerequisites, approval gating, cancellation recovery, direct confirmation, top-up versus supplier settlement, unknown-result guards and stale responses. Bank and payment responses are simulated; production duplicate prevention still requires a backend contract.
