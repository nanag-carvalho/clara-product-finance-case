# Payment wizard: service and interaction contract

## My design decision

I am replacing the full-page collection of cards with a controlled payment wizard. The dialog is its desktop container; the state machine determines progression. The payment list stays underneath, and closing the wizard keeps the current in-memory request available through Resume payment. Refresh persistence is a production requirement, not implemented in this prototype.

The Origin images supplied for this case inform the contained, sequential presentation. They do not establish a payment-security pattern. Nu Empresas informs the familiar recipient → review → confirmation sequence. W3C WAI informs logical grouping, explicit progress, focus and retaining entered information. Progress is orientation feedback rather than a reward for moving money; success feedback follows a confirmed service result.

## Observed baseline and proposed experiment

| Observed demo | Proposed interaction | Hypothesis and measure |
| --- | --- | --- |
| Payments lists amount, method, status and attachments. The captured screens do not expose a complete initiation flow. | Keep the list and open a focused task with visible source and recipient. | O1-H4: correctly identify recipient, amount and debited account; record hesitation and omissions. |
| Tasks shows an approval action and waiting age. Details of the full approval process remain an evidence gap. | Separate requester, company approver and bank-authorized representative by service state. | O1-H2: explain what the action permits, identify the next actor and distinguish approval from settlement. |
| Account and Payments expose different balances and statuses. | Carry the money route across phases; Path B retains separate funding and payment outcomes. | O1-H1: check the intended source and debited-account comprehension; assess A/B effort as a separate conditional service comparison. |
| List screenshots expose failed/rejected states, but recovery details are not observed. | Keep the request, query uncertain results and retry only after a definitive failure. | O1-H3 (required guardrail): recover without intending a duplicate payment. |

These are testable design gains, not measured results. A wizard alone does not prove improvement over the existing product.

## Feasibility gates before production

- Confirm Clara's own authorized initiation role or the regulated partner that supplies it. Verify the supported Brazilian business accounts and their authorization mandates. The prototype does not establish those capabilities.
- Select the applicable Open Finance journey with the provider. This case assumes bank redirection. Account linking for a no-redirection journey is a separate regulated capability and is not interchangeable with this assumption.
- A first-time bank selection/identification may be useful preparation, but an extra standalone account-connection consent is not assumed to be a universal payment API requirement. Confirm it with the provider; merge preparation into payment-specific consent if the supported journey allows it.
- Keep internal company approval distinct from payment-specific consent, bank authentication/authorization and execution. Consent payload, scope, validity and authorized actor must match the approved payment.
- Path A depends on eligible external-account payment initiation. Path B adds a top-up and a separately executed supplier payment. Define the legal/service basis and authorization policy for each leg before releasing either.
- Validate current production API versions, certificate/security profile, provider sandbox conformance and Pix/account limits. Historical Open Finance API material illustrates sequencing only, not the current deployable contract.

## State and backend responsibilities

| Boundary | Required service behavior | UI behavior |
| --- | --- | --- |
| Draft and recipient lookup | Validate format, resolve recipient via supported service, rate-limit lookup, return only permitted identity data. | Inline errors, confirmed recipient identity, retained draft. |
| Company request | Persist immutable amount, recipient, source and approval version; enforce server-side roles. | Name the pending actor. Editing payment-critical fields invalidates prior approval. |
| Bank handoff | Backend creates the applicable consent, correlates redirect state, verifies callback and expiry. Credentials remain with the bank. | Explain the bank destination and transaction; allow cancellation without claiming payment. |
| Payment submission | Server-side idempotency scoped to the payment intent and each money leg, repeated-click protection, authorization recheck. | One submission action; processing state. |
| Pending/unknown outcome | Correlate callbacks or query provider status; reconcile authoritative results. A missing response is not a definitive failure. | Query the same request; block a new submission. |
| Definitive failure | Record a supported reason code and reconcile funds; define which approvals/consents can still be reused. | Contextual remedy. Never blindly reuse expired consent on retry. |
| Top-up success / supplier failure | Track distinct identifiers and outcomes; keep confirmed funding separate from supplier settlement. | Retry only the unpaid leg when permitted. |
| Confirmed completion | Produce authoritative transaction reference, amount, recipient, source and timestamp. | Success state and downloadable receipt. |

The local reducer models these UI boundaries. It does not perform server-side consent validation, bank authentication, role enforcement, persistence, idempotency or reconciliation. Those are acceptance criteria for integration.

## Wizard interaction requirements

- Controlled open/current state; validation and authorization owned by the service consumer, not by the container.
- Logical phases with current phase announced in text and aria-current; progress bars do not indicate settlement.
- Back is available only at valid boundaries. Editing a review resets internal approval. Irreversible submissions cannot be undone through a previous-step control.
- Close dismisses the task without canceling a submitted transaction. Drafts remain in the session; processing continues and can be resumed from the list.
- Accessible dialog name/description, focus inside the dialog, keyboard focus trap, escape to close, focus to the step heading on transitions. On dismissal restore focus to a meaningful launch control.
- A production session timeout needs advance warning and an approved recovery policy. Sensitive draft fields belong in an authenticated backend, not an unprotected browser cache.
- Audit events record actor, payment version, consent correlation, leg and service result. Avoid storing secrets or full sensitive identifiers in client interaction logs.

## References

- [W3C WAI: Multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/) — logical grouping, progress and retaining entered data.
- [W3C WAI: Make each step clear](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p04-clear-steps/) — orientation through multi-step tasks.
- [Nu Empresas: Pix PJ](https://nubank.com.br/empresas/conta/pix) — product reference for business payments; not evidence for Open Finance integration.
- [BCB: Instrução Normativa 759](https://www.bcb.gov.br/estabilidadefinanceira/exibenormativo?numero=759&tipo=Instru%C3%A7%C3%A3o+Normativa+BCB) — journey data and distinct redirection/no-redirection concepts; verify applicable consolidated rules before implementation.
- [BCB: payment initiation](https://www.bcb.gov.br/estabilidadefinanceira/pix-sobre) — distinction between account provider and initiation role.

Reviewed for this case on October 14, 2026. Regulatory/provider feasibility remains a delivery gate, not a compliance claim.
