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
- Proposal: design and prototype scope under evaluation. The interactive prototype covers connection, review, approvals, Pix and recovery on two simulated money paths.

`../docs/clara-as-is/README.md` is the research source. `scripts/sync-research.mjs` builds `src/data/research.json` and copies assets to `public/research` before development and production builds. `src/data/library.ts` organizes visual references and their provenance.

All authored interface and documentation copy is in English. Original Clara screenshots, GIFs and supporting PDFs retain their original language to preserve evidence. Asset filenames and source URLs also remain unchanged.

## Design system

Open `/design-system.html` for the independent documentation: foundations, grouped component pages, patterns and previews. The build produces `dist/index.html` and `dist/design-system.html` and `dist/prototype.html`.

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

Open `/prototype.html?path=direct` or `/prototype.html?path=topup`. Product navigation connects Overview, Payments, Approvals, Accounts and Activity. Test controls simulate success, confirmed failure and unknown outcomes, export an interaction log and restart trials.

Run `npm test` for the payment-state invariants. No bank API or real payment is called. User-validation results remain to be collected.
