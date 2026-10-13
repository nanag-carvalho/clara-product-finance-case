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

The opportunity I want to explore is using those funds within Payments while keeping the source, approvals and outcome clear. This could reduce operational effort and make Clara more useful in everyday accounts payable, but I still need to validate whether it increases adoption and repeat use. I do not have internal abandonment, revenue or transaction-volume data to quantify the opportunity.

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

Before consolidating high fidelity, I need to confirm the business-account journey and the approval rules of the selected banks. The Central Bank describes consent, authentication at the account-holding institution and return to the initiator. Regulation also covers journeys without redirection, but does not establish availability for this combination of business account, bank and device.
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

## Opportunity evaluation and selected focus

I organized four candidate opportunities around completing eligible supplier payments with less active effort and intact controls. The tree is a synthesis of the brief, desk research and my interpretation; its branches are not interview findings.

| Opportunity | Evidence and brief fit | Learning value within two days | Main dependency | Decision |
| --- | --- | --- | --- | --- |
| Use external funds without a separate top-up task | Directly addresses the problem in the brief | Compare two concrete funding paths | Eligible PJ bank journey and initiator capability | Selected for the prototype |
| Understand who must authorize and what happens next | Supported by existing approval rules and the new bank dependency | Test review comprehension | Bank signatories and company permissions | Required within the selected flow |
| Recover without re-entering details or duplicating payment | Failure is explicitly required by the brief | Test one recovery branch | Reliable payment status and duplicate prevention | Required within the selected flow |
| Handle many supplier payments at once | Weekly volume in the brief; Clara documents batch Pix | Valuable but adds consent and partial-result complexity | Batch support and authorization limits | Defer |

I selected external funding in the payment context because it directly addresses the stated friction and gives me a focused way to investigate first connection, review, authorization and recovery. I am prioritizing learning against the brief, not claiming that the business opportunity has been quantified.

The solution alternatives are direct payment from an external account and a Clara-initiated top-up followed by payment. I will compare both before consolidating the design. Direct payment is a candidate, not a confirmed capability of Clara. If feasibility blocks it, the top-up alternative still needs transparent movement tracking and recovery.

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

I am using an empathy map to organize what I need to understand about the finance manager beyond the brief's company profile. This is a provisional map, not interview evidence. The user voice is represented by the scenario in the brief and questions to investigate; I have not collected verbatim quotes.

| Dimension | Working interpretation | Evidence level | What I need to hear or observe |
| --- | --- | --- | --- |
| Does | Moves funds from a bank to Clara before paying suppliers | Explicitly described in the brief | Walk me through the most recent payment: where did you leave Clara and why? |
| Thinks | Needs to know which balance funds the payment and whether approvals are complete | Design inference | What do you check before submitting, approving and considering a payment finished? |
| Feels | May be uncertain after leaving Clara or when a payment has no clear outcome | Unvalidated assumption | At what point do you become unsure, and what do you do next? |
| Says | No direct quotes collected | Research gap | How would you describe the hardest part of paying suppliers in your own words? |
| Pain | Separate funding step; possible repeated entry or status checking | Funding step from brief; other pains unvalidated | What takes active work, what is waiting, and which workarounds do you use? |
| Gain | Pay the intended supplier from the intended account with clear control and outcome | Proposed need to validate | What would make you trust this flow enough to use it again? |

I will keep a short evidence log: role, task context, observation or exact quote if collected, source, date and the design decision it affects. If no user sessions fit the two-day window, these questions and gaps remain visible; a heuristic review does not become a user interview.

To bring the business perspective into my decisions, I use the brief and Clara's public value proposition to connect design decisions to candidate outcomes: eligible payment completion, adoption and repeat use. Approval and exception needs come from documented behavior; bank eligibility and authorization remain implementation dependencies. These are candidate business outcomes to validate.

## Jobs to be done and decision traceability

**Primary job, inferred from the brief:** When I need to pay a supplier and the money is held at another bank, I need to use the intended funds within my payment workflow and preserve required approvals, so I can pay the correct recipient and understand the outcome without managing a separate funding task.

The emotional dimension I would validate is confidence about source and outcome. The organizational dimension is accountability: requester, company approver and bank-authorized representative may be different people. I should not design those roles as interchangeable.

**Candidate business job:** When a customer already organizes supplier payments in Clara but funds them elsewhere, help that customer complete eligible operations through Clara with intact controls, so Accounts Payable becomes useful more consistently. This is a business hypothesis, not a confirmed internal objective.

| Opportunity or requirement | Job fragment | Hypothesis | Experiment | Decision criterion |
| --- | --- | --- | --- | --- |
| Selected opportunity: external funding in context | Use the intended funds without a separate funding task | O1-H1: source selection in the payment flow reduces avoidable switching | Compare direct external payment and initiated top-up | Correct source comprehension and successful completion without critical errors |
| Requirement: clear authority and next step | Preserve approvals and know who must act | O1-H2: explicit actors and stages reduce confusion | Requester/approver explain review and next authorization | Distinguish company approval, bank authorization and settlement |
| Requirement: safe recovery | Know the outcome before trying again | O1-H3: retained context and specific states support safe resumption | Interrupted authorization, confirmed failure and unknown outcome | Resume without re-entry or duplicate-payment intent |
| Deferred opportunity: supplier volume | Repeat the job across many suppliers | Future hypothesis: batching reduces repetitive work | Deferred until individual flow and bank support are understood | Outside the two-day prototype |

These criteria are diagnostic for design iteration. I have no baseline or completed experiment from which to claim reduced time, higher adoption or commercial impact. I will revise the job and opportunity tree if user evidence contradicts the assumptions.

## Hypothesis portfolio by opportunity

I am recording multiple hypotheses for each candidate opportunity, while keeping the proposal and prototype focused on **O1: external funding within the payment context**. O2 and O3 surface needs that O1 must respect; I am not building separate approval or recovery products. O4 remains deferred.

| Candidate opportunity | Hypothesis | What could support or challenge it | Prototype scope |
| --- | --- | --- | --- |
| O1 — external funding in context | O1-H1: presenting the source during payment creation could remove avoidable switching compared with a separate top-up task | Path comparison; completion, correct source and active effort | Selected |
| O1 — external funding in context | O1-H2: separating company approval from bank authorization could make the next actor and step understandable | Requester/approver explain who acts next and whether funds moved | Selected |
| O1 — external funding in context | O1-H3: a preserved draft and explicit outcome could support recovery without a duplicate attempt | Authorization interruption and unknown-outcome task | Selected |
| O1 — external funding in context | O1-H4: grouping source, recipient and amount with the related action could reduce review omissions | Locate and explain the three details; identify the next action | Selected |
| O2 — understand authority and next steps | O2-H1: showing the next responsible person could reduce status-checking effort | Observe how the team currently follows up on approvals | Candidate; no separate prototype |
| O2 — understand authority and next steps | O2-H2: explaining each approver's scope could reduce confusion between company and bank permissions | Compare comprehension across requester and signatory roles | Candidate; dependency considered in O1 |
| O3 — recover with context | O3-H1: retaining payment data after interruption could reduce repeated entry | Observe resumption and fields re-entered | Candidate; requirement considered in O1 |
| O3 — recover with context | O3-H2: different actions for confirmed failure and unknown outcome could discourage unsafe retries | Ask what the person would do in each state | Candidate; requirement considered in O1 |
| O4 — supplier volume | O4-H1: reusing a verified source across eligible batch items could reduce repetitive setup | Batch task study after bank eligibility is established | Deferred |
| O4 — supplier volume | O4-H2: item-level results could make partial failures easier to reconcile | Partial-result comprehension and recovery task | Deferred |

### Selected opportunity: UX and UI experiments

| Hypothesis | Design variable | Experiment and measure | What I would change based on evidence |
| --- | --- | --- | --- |
| O1-H1 | Direct external payment versus initiated top-up | Same supplier task on both paths; completion, correct source, active time and avoidable navigation | Choose a feasible money path and its entry point |
| O1-H2 | Review content, actor labels and authorization sequence | Explain source, next actor and current state without prompting; log each correct/incorrect answer | Revise review copy, role distinctions and transitions |
| O1-H3 | Retained context and recovery actions | Return from interrupted authorization; inspect unknown outcome; log re-entry and duplicate-payment intent | Revise return state, status detail and safe next action |
| O1-H4 | Proximity, hierarchy and action placement using the DS | Locate source, recipient, amount and next action in review; record omissions and hesitation | Adjust grouping, emphasis and related actions without changing the DS scale |

I will log observations per task and distinguish a participant's answer from my interpretation. Source mistakes, confusing approval with settlement, lost drafts and duplicate intent are critical issues. I will address them before consolidating the flow. These are formative checks, not evidence of a statistically measured uplift.

The two-day delivery still covers one coherent O1 flow. Four hypotheses guide different aspects of that same experience; they do not require four features or four independent prototypes.

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
