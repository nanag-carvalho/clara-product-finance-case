# Release review · 14 October 2026

This review evaluates the interview artifact against a senior design engineering standard. Scores are provisional expert judgments, not participant outcomes, independent certification or a hiring prediction.

| Area | Score | Evidence supporting the assessment |
| --- | --- | --- |
| UX | 9/10 | Funding entry acknowledges the existing Clara-balance route; recipient recognition is explicit; approval and authorization are separate; correction and uncertain-result recovery retain the same request. |
| Desktop UI | 9/10 | Shared hierarchy, native Phosphor icons, restrained surfaces, consistent image references, contextual queues and a compact sidebar entry. |
| Heuristics | 9/10 | Visible state/owner, editable review, preserved context, guarded retry, explicit decision confirmation and feedback after bulk actions. |
| Mobile UX/UI | 9/10 | Financial tasks use a full-screen wizard with stable actions; keys remain readable; list rows prioritize recipient/value; filters use a bottom sheet; selection is deliberate; primary controls use 44px minimum targets. |
| DS use | 9.2/10 | Typed public API, explicit responsive hierarchy props, controlled composition, generated contracts and installable registry artifacts. Published dependencies use the production origin. |
| Code | 9/10 | Discriminated command types, focused views, pure queue selectors, explicit review groups, cancellable simulated tasks, duplicate-ID guards, deterministic scenarios, checked test types and a reproducible CI verification command. |

## Audit changes

- Split navigation, setup, scenarios, details, source, outcomes, actions, queue filters/table and workspace views from the controller. `Prototype.tsx` went from 3,332 formatted lines to about 1,270; boundaries and command ownership matter more than the line count.
- Replace position-based review grouping with explicit payment/context groups.
- Keep timers in `useDeferredTask`; invalidate queued callbacks on cancellation and reject repeated starts.
- Supply the clock at the reducer boundary, reject duplicate payment IDs, and preserve selection on other pages.
- Type-check the application and the tests. Keep source names, comments and implementation documentation in English.
- Materialize all 53 registry items from local sources; output matched the previous CLI-generated JSON. Building no longer downloads a registry CLI.
- Improve mobile filters, selection, reading hierarchy, touch targets and notification placement. Preserve the compact banner while restoring 8px between description and action.

## Showcase and hub release review

The showcase now connects opportunity, design reasoning, experience and implementation. Authorship notes identify concrete human direction and AI assistance beside each chapter; the hub supplies the detailed decision trace. Repository links connect reuse claims to source, contracts and browser tests.

This pass removed 24 obsolete showcase CSS rules, corrected the standalone research renderer for cropped and public-root asset references, documented all four application entry points and excluded local publishing/QA files from Git. The mobile header uses a more compact brand/action row. The existing scores above are subjective review estimates, not a substitute for the evidence below or an independent senior-level assessment.

Remaining engineering tradeoffs: the showcase stylesheet still contains overlapping layout rules from visual iteration, and the prototype controller remains larger than ideal. Payment services are simulated. Browser emulation and regression tests do not establish real-device accessibility or usability outcomes.

## Verified

`npm run verify` passes formatting, strict application/test TypeScript, all **39 tests**, generated DS/contract checks, registry output and production build. Dependency audit reports zero known vulnerabilities at this snapshot.

Browser checks cover mobile input/source/review, populated lists, search, filtering, sorting, selection and bulk confirmation. Three approved requests move pending approval from three to zero and authorization from two to five without executing Pix. Desktop checks cover individual approval, authorization to simulated paid state, contextual correction, and New payment loading into the task.

The browser review found and corrected a native timer invocation regression that model tests did not detect. This is why the release includes interaction verification in addition to build/test gates.

## Remaining work and scope

A larger implementation should further split account preparation and task orchestration. Automated end-to-end checks now cover the critical prototype flows in Chromium desktop and mobile emulation. Physical-device keyboard, screen-reader and participant-comprehension testing remain unverified. Bank identity, permissions, durable idempotency, persistence and actual Pix execution require production services; the local actor/camera/service controls are simulations. No adoption result or business uplift is claimed.

Real-device and independent review limits prevent a defensible 9.5 across every dimension. The current judgment is strong case quality with inspectable implementation evidence, not a promise about an evaluator's score.

## End-to-end follow-up

After the single production deployment, Playwright was added to the source workspace and CI. All **13 browser executions pass** (one desktop-only skip for the mobile-specific check), in addition to 39 domain/registry tests. The complete journey creates a request, approves that request, selects it for authorization, confirms with the device and verifies its paid result. Separate checks cover approval without settlement, correction, bulk approval, uncertain-result recovery and mobile filters/selection/overflow. Every test captures browser runtime errors as failures.

Run `npm run test:e2e`; use `npm run verify:full` for the combined gate. The test server builds and serves the production bundle independently of the user's development browser. Traces and screenshots are retained on failures. No second deployment was performed for this source-only test addition.
