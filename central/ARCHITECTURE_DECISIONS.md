# Design engineering decisions

This is an interview prototype with an executable design system. Its purpose is to make product reasoning, interaction decisions and implementation quality inspectable together.

| Decision | Reason and consequence | Evidence |
| --- | --- | --- |
| Separate company approval from payment authorization | A company decision permits the next action; it does not move money. Recovery retains the original payment ID. | `model.ts`, `flow-model.ts`, lifecycle tests |
| Keep financial rules out of the DS | Reusable UI can express hierarchy, state and interaction without becoming a permissions or payment engine. Controlled views issue commands through the controller. | Public DS API; `PaymentActions`, `WorkspaceViews` |
| Use one queue contract for two layouts | Mobile needs readable rows and deliberate selection rather than a reduced desktop table. Both layouts preserve ordering, selected IDs and review actions. | `payment-queue.ts`, `PaymentTable`, queue tests |
| Encode hierarchy in component props | Input actions may move below a field; recipient/value have emphasis; Pix keys can span the mobile review width. Consumers describe intent instead of altering primitive internals. | `InputGroup.actionLayout`, `ReviewField`, explicit review groups |
| Make the DS machine-readable | Registry metadata and generated artifacts give AI-assisted work the same components and tokens as human-authored work. Build checks detect covered drift; they do not judge product quality. | `registry.ts`, `generate-ds.mjs`, `check-ds.mjs`, registry tests |
| Keep transitions brief and cancellable | Motion marks a task/context change and supports brand continuity. A pending simulated operation must not run twice or update a newly loaded scenario. | `useDeferredTask`, injected-clock tests |
| Make research provenance visible | Observed screens, reconstructions, proposals and validation gaps must remain distinguishable. No adoption or comprehension outcome has been measured. | Research source labels and boundaries |
| Use one reproducible verification command | Application and test types, formatting, domain rules, generated DS data and production bundling are checked locally and in CI. | `npm run verify`, workflow |

## Deliberate limits

Bank identity, provider authorization, persistence, idempotency across sessions and actual Pix execution require production services. The local actor context is a demonstration control, not authentication. QR capture and payment responses are simulated. The existing Clara-balance route is acknowledged but not implemented here.

The controller still composes several task concerns. Further growth should split account preparation and payment-task controllers by responsibility, rather than extracting arbitrary blocks only to reduce file length. Automated Chromium desktop/mobile regression checks cover the critical interface journeys. Real-device keyboard, screen-reader and participant-comprehension checks remain release work for a real product.
