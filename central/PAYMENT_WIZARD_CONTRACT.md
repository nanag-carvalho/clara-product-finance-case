# Payment wizard contract

## Proposed service direction

The case explores Open Finance payment initiation without redirection after account and device linking. The money route is external bank → supplier. This is a design direction contingent on provider and business-account eligibility.

Initial setup: choose institution → review linking purpose → authenticate and confirm at the bank → return and establish the device security credentials. Subsequent eligible transactions: enter payment → select linked source → review → company approval → payment-specific device authorization → authoritative outcome.

Sources: [BCB Resolution 406](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=406&tipo=Resolu%C3%A7%C3%A3o+BCB), [BCB Instruction 760](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=760&tipo=Instru%C3%A7%C3%A3o+Normativa+BCB). PJ support, provider authorization, current versions, signatory mandates and channel eligibility require validation before implementation.

## Interface contract

- Use the shared DS Wizard, RadioGroup, Field/InputGroup, ReviewSummary, Alert, Button and Receipt API.
- Selecting an account changes selection only. Continue advances after validation.
- Back retains valid fields. Changing recipient, amount or source invalidates prior review and applicable approvals.
- Save requests outside the wizard while approval is pending. Company decisions happen in the approver queue; authorization becomes available only after approval. New payment preserves other intents and service responses are correlated to their own intent.
- Name the acting role. Internal approval, account linking and payment authorization have distinct consequences.
- Device authentication is a security boundary. The prototype represents its result; production must use the verified provider/device mechanism, never a decorative biometric confirmation.
- Keep progress and primary actions stable; focus the new heading, provide keyboard selection and respect reduced motion.

## Service guards

| State | Required behavior |
| --- | --- |
| Account linking | Verify institution, account, authorized identity, consent and device credentials; support expiry/revocation. |
| Review and approval | Persist the payment version and enforce server-side roles. |
| Authorization | Require a valid linked source, approved payment version and verified payment-specific authentication. |
| Submission | Persist intent identity and enforce backend idempotency. |
| Processing / unknown | Query the same intent; prevent another financial submission while unresolved. |
| Confirmed failure | Present a supported remedy; repeat review and applicable approval/authorization. |
| Confirmed paid | Show authoritative reference, source, recipient, amount and receipt. |

The prototype uses controlled responses and session state. Tests verify transition guards; participant sessions evaluate comprehension and task performance.

### External confirmation boundary

The connection step explains the bank authentication, account selection and consent before leaving Clara. Bank screens are outside the prototype. An explicitly labelled continuation represents receipt of the bank confirmation; it does not authenticate a real account. Clara then displays the returned account, requests device credential confirmation and records the connection only after completion. Device confirmation is represented in the prototype; a production integration must use the supported device credential ceremony and validate the bank response.

## Heuristic audit and scenario coverage — October 14, 2026

This is an inspection of the prototype and its state model, not participant validation or production assurance. Motion communicates a transition; the persistent state, actor and next action carry the meaning.

| Heuristic | Current treatment | Remaining gap |
| --- | --- | --- |
| Visibility of system status | Loading, semantic badges, saved request, company decision, authorization and final outcome are distinct | Timeout and prolonged waiting need a realistic service contract |
| Match with the real world | Supplier, amount, external bank and company reviewer are named | Recipient metadata and optional supporting-document selection are implemented as fixtures; real service responses/storage remain |
| User control and freedom | Back, save/close, edit, cancel authorization and reopen request retain context | Cancellation after submission and bank consent refusal need separate flows |
| Consistency and standards | Shared DS controls; completed milestones use filled checks; status uses text, icon and color | Full keyboard and screen reader inspection remains required |
| Error prevention | Recipient lookup and positive amount; role guard; approval before send; same-intent uncertain result | Duplicate invoice warnings and real account/device eligibility checks remain |
| Recognition rather than recall | Details persist through review, actor change and authorization; request history is contextual | Production records need actual names, dates and recipient metadata |
| Flexibility and efficiency | Search supplier/reference, bank/status/date filters, ten-row pagination, actionable queues | Custom date range, sort controls, saved views, delegated roles and bulk actions need research |
| Aesthetic and minimalist design | Full-width banner and table; attention/accounts grouped separately; no nested colored queue cards | Responsive review at all supported widths remains |
| Error recognition and recovery | Field errors, interrupted authorization, confirmed failure and unknown outcome have separate messages | Rejection/reason and expired-link recovery are implemented; service outage and real device lifecycle remain |
| Help and documentation | Connection boundary and next action appear where needed | Contextual support for inaccessible devices and failed reconciliation remains |

| Scenario | Current coverage | Validation still needed |
| --- | --- | --- |
| First payment, new account | Details → bank selection → external confirmation boundary → device → review | Real provider return, business signatory eligibility and account payload |
| Existing connected account | Select source → review → request company approval | Expired-link recovery is implemented; a new-device ceremony remains |
| Company review | Assigned reviewer records approval; authorized representative resumes | Reject with reason is implemented; multiple layers, delegation and automatic policy are not simulated |
| Happy path | Device confirmation → processing → authoritative simulated success → receipt/history | Real integration, receipt download and production persistence |
| Invalid recipient/amount | Inline errors; continuation blocked | More Pix formats, copy-and-paste payload and recipient mismatch |
| Authorization canceled | Payment and approval retained; user can retry confirmation | Real platform credential cancellation |
| Insufficient balance | Failure message; review/reapproval before retry | Production-specific restrictions and other error codes |
| Unknown outcome | Same request status check; no resubmission of that request | Reconciliation latency and escalation to support |
| Concurrent requests | Independent intents and event histories; correlated responses | Backend authorization, race conditions and idempotency |
| Queue at volume | Search, bank/status/update-period filters, pagination and empty results | Large datasets, server-side sorting/filtering, accessible table navigation |

Implemented for presentation: recipient/context metadata, rejection with reason and expired-link recovery. Outside this interview deliverable: assistive-technology evaluation, provider-specific integration and participant testing. Priority before production: provider eligibility, consent/device lifecycle, signatory permissions, secure credentials, idempotency and reconciliation. The prototype does not establish that all scenarios are supported.

## Audit implementation update

Implemented locally after the inspection:
- Shared table container spacing; empty queues hide filtering and pagination; pagination appears only above ten matches.
- One anchored Filters popover with source bank, payment status and update period; custom dates, removable applied chips and sorting by update, amount or supplier.
- Recipient identity metadata, optional description and document selection retained across review and correction.
- Rejection requires the approver role and a nonempty reason; correction returns to entry and requires a fresh company decision.
- Expired connection can be triggered through Scenarios; authorization routes to reconnection and renewed review, preserving payment context.
- Updated receipt time comes from the recorded settlement event, rather than the current date.
- Overview contains the entry banner, actionable queues and recent requests; bank-account management stays in its dedicated page.
- Checking-payment illustration keeps its arrow within the circular boundary.

Verification: model tests cover recipient metadata invalidation, context preservation, rejection permissions/reason and expired-link authorization. Browser inspection verified a source filter against matching rows, rejection reason validation and return to correction. These are prototype checks, not observed usability results.

Remaining limits: document selection stores its filename only; upload, scanning, storage and download require production services. Recipient identity and bank data are fixture responses. Real bank authentication and device credential ceremonies are outside the prototype. General server errors, offline behavior, post-submission cancellation, delegation and multiple approval layers remain integration/product scenarios. Keyboard inspection does not replace assistive-technology testing or a WCAG conformance assessment.

Filter interaction reference: [Linear Filters](https://linear.app/docs/filters). The adopted principle is contextual criteria selection with immediate list updates and visible applied filters. It is a design inference, not evidence of usability results for this prototype.

## Interview-case simulation scope

The deliverable is a plausible interactive interview case. No live Clara/bank access, external authentication, participant study or production integration is required. Scenario controls represent provider responses; conclusions describe design reasoning and simulated behavior, not measured user outcomes.

Confirmed failure simulations distinguish insufficient funds, bank limit and a service response confirming no completion. A missing response remains unknown and offers a same-request status check; it is never treated as a confirmed failure. Connection refusal retains the payment and offers another connection attempt. Device/account expiration is represented through scenario controls. Production-specific mandates, credential flows, consent payloads, uploads and reconciliation are stated boundaries.

## Decision questions for the case walkthrough

| Evaluator question | Decision and available answer |
| --- | --- |
| Why is a person named in the page header? | Removed. The page describes an approval task; the assigned person belongs to a request, recorded decision or signed-in identity. |
| Does a company with 200 employees have one approver? | Headcount does not determine approval policy. The prototype uses one illustrative assigned-reviewer scenario. Clara's existing policy can involve automatic actions and up to five layers; this proposal preserves that engine rather than replacing it. |
| Who can approve? | The prototype models requester and approver actions separately. Production permissions are not inferred from the 200-employee brief. The scenario explorer makes the role context explicit. |
| Why show supplier, source and amount before authorization? | Recognition and error prevention: the person can compare the approved payment and account without remembering an earlier screen. |
| Why show the next actor and milestones? | Company approval, device authorization and final settlement are separate commitments. A saved or approved request must not imply money moved. |
| Why use a global queue? | It groups actionable request states at volume. Names belong to rows/details, not the queue title. Assignment/permissions would scope the production queue. |
| Why no separate Activity page? | Available Payments evidence does not establish a global activity page; a per-payment history preserves useful context. |
| Why are simulation controls outside the product toolbar? | They support the evaluator's exploration, not a finance user's job. The floating scenario launcher opens a concrete state and identifies the relevant hypothesis. |
| What proves the hypotheses? | The case provides evidence-based reasoning and an interactive simulation. It does not claim participant validation or production integration. |

Approval reference already reviewed in discovery: [Clara approval workflow](https://ajuda.clara.com/hc/pt-br/articles/41962086294291-Como-crio-um-fluxo-de-aprova%C3%A7%C3%A3o-de-pagamentos-na-Clara).

## Fit within Clara's observed navigation

Reference: supplied Payments demo screenshot, preserved at docs/clara-as-is/assets/06-pagamentos.png. Groups and order are retained: Account (Summary, Transactions, Tasks), Management (Cards, Reimbursements, Team, Company, Activity), Digital account (Dashboard, Pix area, Settings), Accounts payable (Inbox, Payments), Benefits (Partners, Points, Referrals). English labels are translations for the case; they do not propose a product-wide renaming.

Overview, Payments and the proposed Connected banks destination are interactive. Other modules preserve context and are outside this prototype's scope. Payment approval is a local Payments view rather than an invented standalone sidebar module. The existing Activity item stays in Management as inactive context; per-payment history remains within the payment detail.

Proposed additions: Connected banks is placed under Digital account because account/device consent is reusable beyond one request; it is not presented as an existing Clara item. The local Overview summarizes payment work and is a proposed view, distinct from the observed account Summary and the original payment-list overview. No claim is made that the navigation was reorganized or validated with users. The scheduled-payment view is not implemented because this case simulates immediate Pix initiation after approval and authorization.

Navigation density decision: only one sidebar group expands at a time. Group headings can be explored; modules outside the case remain non-navigable. The current task's group opens when navigating to Payments or Connected banks. This is a proposed density/access pattern, not claimed as observed behavior in the source screenshot.

## Inbox and the proposed Overview

[Clara's Inbox documentation](https://ajuda.clara.com/hc/pt-br/articles/53697384746515-Caixa-de-Entrada-para-Contas-a-Pagar-receba-e-organize-seus-pagamentos-automaticamente) describes receiving invoices/bills via email or upload, extracting data and creating drafts for review. Inbox is upstream of payment preparation; it is not an operational overview.

Navigation refinement: Overview is an explicitly proposed item at the beginning of Accounts payable, followed by the existing Inbox and Payments. It summarizes pending company review, authorization and confirmation, with direct access to actionable queues. Inbox remains visible and inactive because document intake/OCR is outside this case. Overview is removed from the local Payments tabs to avoid two routes presenting the same navigation choice. Existing Account Summary retains its broader account purpose. This adds a scoped operational destination rather than renaming Inbox.

## Existing balance and unified Pix input

New payment opens an anchored source popover. Clara balance remains an existing route, explicitly outside this case's interactive scope; the business-bank option starts the proposed external-funded Pix. This adds a funding choice without replacing Clara's balance/payment journey.

The entry field accepts email, CPF/CNPJ, phone, random key and static Pix Copia e Cola. Recognition is automatic; numeric ambiguity is disclosed and resolved through recipient confirmation in the proposed provider contract. Local document checks and static payload TLV/CRC validation do not establish a registered key or an authoritative payee. Demo lookups return fictional identities. Encoded amount is retained and locked after lookup.

The QR scanner is a labeled camera simulation. It never requests media permission or accesses a real camera. The example resolves to a valid local static payload and then uses the same recognition and recipient lookup path as Copia e Cola. Dynamic QR charges are recognized but resolution is outside this simulation; expiry, charge status and provider-resolved amount require production validation. No real key directory or dynamic charge is queried.

## Final navigation, responsive behavior and presentation

Pending approval is a Payments filter, not a separate Pending/Reviewed page. Its rows open Review request with simulated approver actions; bulk approval/rejection operate on selected pending requests. Other statuses remain available in All payments and the dedicated queue controls. Production identity/role enforcement is outside this local simulation.

Desktop uses sortable tables. At mobile width the same records use stacked rows with source, amount, status, update time, selection and action visible; sorting is a mobile list control. The wizard keeps one content scroll and its action footer; progress/history are expandable within that scroll.

Scenarios starts with empty/populated workspace choices, followed by preparation, company-decision and recovery groups. Service response settings are secondary and collapsed. The former interaction-log export was removed; per-request history remains available.

The sidebar promo introduces supplier Pix in Clara using external-bank funds; existing Clara balance is preserved in New payment. Its entry transition is full-screen, translucent and lightly blurred, before opening the existing wizard. The promo/adoption hypothesis remains a candidate pending visual approval. Brand loading is presentation feedback, not a security credential or proof of settlement.
