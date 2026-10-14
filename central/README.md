# Clara Case hub

My local research, walkthrough and proposed solution for the Clara Product Finance interview case.

## Run locally

Requirements: Node.js 24 or later and npm. From the repository root:

```sh
cd central
npm ci
npm run dev
```

Open `http://127.0.0.1:5173`. The application uses React, TypeScript, Vite, Tailwind CSS and shadcn/ui components added through its official CLI.

```sh
npm run build
npm run preview
```

## Content and navigation

- Product and opportunity: value proposition, business hypotheses and candidate metrics.
- Discovery: provisional empathy map, user/business evidence gaps and jobs to be done.
- Desk research: Conta Simples, Cora and Ramp, with source boundaries and visual references.
- Opportunities: one selected funding opportunity, Brazil dependencies and a two-day scope.
- Research: brief, current journey by stage, screen library, sources, gaps and product experiments.
- Presentation: six initial walkthrough slides with notes and keyboard navigation.
- Proposal: design and prototype scope under evaluation. The interactive prototype covers connection, review, approvals, Pix and recovery with simulated external-bank funding. The existing Clara-balance route is acknowledged at entry, outside the interactive scope.

`../docs/clara-as-is/README.md` is the research source. `scripts/sync-research.mjs` builds `src/data/research.json` and copies assets to `public/research` before development and production builds. `src/data/library.ts` organizes visual references and their provenance.

All authored interface and documentation copy is in English. Original Clara screenshots, GIFs and supporting PDFs retain their original language to preserve evidence. Asset filenames and source URLs also remain unchanged.

## Design system

Open `/design-system.html` for the independent documentation: foundations, grouped component pages, patterns and previews. The build produces four entry points: `index.html` (hub), `showcase.html` (visual narrative), `design-system.html` (catalog) and `prototype.html` (interactive payment journey).

Source of truth: `src/design-system/registry.ts`. Public TypeScript API: `@/design-system`. Manifest: `/api/design-system.json`. Contract: `DS_CONTRACT.md` and `/api/DS_CONTRACT.md`. shadcn registry: `/registry.json` and `/r/`. Generated tokens: `src/generated/ds-tokens.css`.

```sh
npm run ds:generate
npm run ds:check
npm run ds:registry
```

The build runs these checks automatically. Spacing: 2/4/8/16/24 px; controls: md32/lg40; radii: control10/card16/overlay20; neutral palette: Slate50–950. Nunito Sans loads locally. Page headings use 20/28, sections 16/24 and groups 14/20. Display32/40 is reserved for presentations.

Components have individual routes, working examples, usage snippets, source loaded on demand and API/contract views. PageHeader supports primary/secondary actions and kebab overflow. Scrolling uses Radix ScrollArea with a neutral thumb. See [shadcn/ui with Vite](https://ui.shadcn.com/docs/installation/vite) and the local contract for implementation details.

## Evidence and validation

Every visual reference is labeled Demo, Official or Reconstruction. Reconstructions are diagrams for validation rather than product screenshots. Proposed components and Open Finance hypotheses remain separate from observed behavior.

Markdown loads on demand and library images use lazy loading. Examples use fictional data. This version has no financial backend, external authentication or real payment execution.

Validation includes the TypeScript production build, generated-token/registry checks, hub navigation, search, screen filtering, image dialogs, walkthrough controls and responsive previews. Contextual interaction and product-flow validation remain necessary.

## Proposed workspace prototype

Open `/prototype.html`. Overview and Payments sit under Accounts payable; Connected banks sits under Digital account. Pending approval filters Payments and opens individual/bulk decisions in context. Unrelated navigation items remain visible but inactive. Scenarios provides empty/populated workspaces and labeled preparation, decision and recovery examples.

Pix input recognizes key types and static Copia e Cola, with explicit recipient lookup and a simulated QR camera. The case has no bank API, real camera, authentication or Pix execution. Automatic policy and multiple approval layers are recognized but not simulated.

At mobile width, payments use stacked rows and the Wizard uses one content scroll, an expandable history and fixed actions. Run `npm test` for payment-state invariants; build includes TypeScript, DS rules and registry checks. The production release uploads the verified static build through Vercel Build Output API v3. Local release metadata stays under the ignored `publishing/` directory; source changes are committed separately to this repository.

## Design engineering implementation

Design decisions are executable: tokens define hierarchy and spacing; shared components define control behavior; typed transitions define when a financial action becomes available. The case and prototype consume the same foundation.

| Responsibility | Source |
| --- | --- |
| Visual tokens, variants and public contracts | `src/design-system/registry.ts`, `DS_CONTRACT.md` |
| Reusable interactions and accessible primitives | `src/components/shared`, `src/components/ui` |
| Payment lifecycle and invariants | `src/prototype/model.ts`, `flow-model.ts` |
| Saved requests, bulk decisions and demo scenarios | `src/prototype/workspace.ts` |
| Responsive payment presentation | `src/prototype/ResponsivePaymentTable.tsx` |
| Case narrative and visual evidence | `src/App.tsx`, `Solution.tsx`, `ResearchMarkdown.tsx` |
| Verification and release review | `tests`, `REVIEW_NOTES.md` |

Use English names and comments that explain intent or constraints, rather than repeating the code. Phosphor provides the shared icon family. The remaining `Prototype.tsx` container is the next extraction boundary; the prototype demonstrates the experience, not a production bank integration.

### Refactoring and mobile composition

`ProductNavigation`, `BankConnectionWizard`, `ScenarioExplorer`, `PaymentFeedback`, `PaymentDetailsStep`, `PaymentFilterSurface` and `SelectionToolbar` separate presentation responsibilities from the workspace controller. `payment-queue.ts` owns pure search, date, status, sort and page-selection rules. `useCompactViewport` selects the filter surface without duplicating filter state. Native Phosphor names replace migration aliases.

Mobile uses an explicit selection mode, readable payment rows, a bottom filter sheet and a full-screen financial task. The DS exposes `InputGroup.actionLayout` and ReviewSummary field emphasis/stacking; consumers state design intent instead of overriding shared internals.

## Review and release

```sh
npm run verify
```

The same command runs in CI: formatting, strict TypeScript for application **and tests**, domain tests, generated DS contracts, registry materialization and production build. Prettier is pinned locally; building the registry does not download a CLI. `DS_REGISTRY_ORIGIN` sets the published registry dependency URLs (default: local development). Release uses `https://clara-finance-case.vercel.app`.

Additional boundaries:

- `WorkspaceViews`, `PaymentTable`, `PaymentFilters` and `PaymentActions` are controlled views; they do not dispatch financial commands.
- `payment-review.ts` declares payment/context groups explicitly, so hierarchy does not depend on array positions.
- `model.ts` uses discriminated command types. `workspace.ts` rejects duplicate payment IDs and unauthorized/mixed bulk decisions.
- `useDeferredTask` owns cancellation and in-flight guards. Scenario changes invalidate queued callbacks. `deferred-task.test.ts` checks that behavior using an injected clock.
- Reducer scenarios receive their clock through actions; fixture dates are stable. UI timestamps are supplied at the boundary.

These boundaries explain the implementation, rather than presenting the simulation as production banking software. See `ARCHITECTURE_DECISIONS.md` for design/engineering tradeoffs.

### Automated browser regression

```sh
npx playwright install chromium
npm run test:e2e
# Combined formatting, types, domain tests, DS/build and browser checks:
npm run verify:full
```

`tests/e2e/payment-experience.spec.ts` exercises the full payment journey through the rendered interface, individual/bulk approval, secure confirmation, correction, uncertain-result recovery and mobile controls. Desktop and mobile emulation run independently against a production build on port 4174. Runtime browser errors fail the tests; failure traces/screenshots are retained. These checks are configured in the CI workflow alongside the 39 domain/registry tests. Emulation does not replace real-device or assistive-technology testing.

## Showcase architecture

`CaseStory.tsx` connects the financial problem to interaction decisions and implementation evidence. `ShowcaseRationale.tsx` contains the supporting rationale, live DS example and replay. `showcase-main.tsx` owns chapter navigation and the shared image dialog; `useShowcaseMotion.ts` owns cancellable reveals and reading progress, with reduced-motion support.

The showcase summarizes the story; the hub carries the detailed decision trace and AI work log. Named same-origin targets keep the presentation open while reusing hub, prototype and catalog tabs. Browser checks cover chapter navigation, image inspection, live component behavior and tab reuse on desktop and mobile.

Local release copies and visual QA captures are ignored by Git. Set `DS_REGISTRY_ORIGIN=https://clara-finance-case.vercel.app` when running `npm run verify:full`, then publish that verified build; production is a simulated case, not a banking integration.
