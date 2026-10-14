# Clara Case design system contract

Version 0.3.0. A local foundation for this case, rather than Clara's official design system.

## API and registry

Import components through `@/design-system`. Register components, tokens, fonts and rules in `src/design-system/registry.ts`. Run `npm run ds:generate` after changes. `npm run ds:check` detects stale artifacts and imports outside the API. Public manifest: `/api/design-system.json`. shadcn registry: `/registry.json`.

## Hierarchy and proximity

Use one functional h1 per page, with an optional description 4 px away. Avoid three labels repeating the context. h2 identifies a section; h3 identifies a group. Display type is reserved for presentations.

Spacing scale: 2, 4, 8, 16, 24 px. Use 2 px for micro adjustments, 4 px between label and field or title and description, 8 px between content and a related action, 16 px between groups and for card padding, and 24 px between sections. Internal spacing must be smaller than spacing between groups. Do not stack child margins on top of container gaps. Stack and Inline accept only this scale.

## Controls and radii

Button and Input: md = 32 px by default; lg = 40 px. Button sm = 24 px. UI text is 14/20; horizontal padding is 8 px for md and 16 px for lg. Inputs retain visible labels, messages associated through aria-describedby and textual errors. Height is a dimension rather than a spacing token.

Radius: small 4 px for small details; control 10 px for Button, Input, Badge and Tabs; card 16 px for larger surfaces; overlay 20 px for Dialog. Badge also uses 10 px, rather than an arbitrary pill. States require text and must not depend on color alone.

## Layers and shadows

White surfaces over a white background. Card uses shadow-card with a Slate 100 border; overlays use shadow-overlay. Tables and internal groups do not accumulate shadows. Light separators preserve grouping. Inputs retain their own outline independently of card shadows. Shadows and colors come from the registry.

## Applied heuristics

- Consistency: use the API and registered variants; the same role uses the same appearance.
- Visibility: distinguish approval, processing and settlement; keep feedback beside the affected item.
- Prevention: review beneficiary, amount and funding source before confirmation; an uncertain result must not encourage duplicate submission.
- Control: Escape closes modals; focus returns to the trigger; back and edit actions preserve context.
- Recognition: explicit labels and actions near their objects, without ambiguous standalone icons.
- Minimalism: product previews use a toolbar, table and compact detail rather than a marketing composition.

Dimensions are case decisions informed by Nielsen Norman Group's [proximity principle](https://www.nngroup.com/articles/gestalt-proximity/) and [usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/). Those sources do not prescribe these dimensions.

## Neutral palette

Slate 50–950 is registered in the API. Primary text: Slate 800; secondary text: Slate 600; card borders: Slate 100; input outlines: Slate 200; surfaces: Slate 50/100. Blue is reserved for actions, selection and semantic information. Descriptive text must not be blue.

## Typography and evidence

Local Nunito Sans is the default font. Comparison with Geist, Plex and Inter is limited to the documentation. Verify loading through FontFaceSet.load, rather than only the computedStyle family name. The scale comes from the registry.

Demo, official source, reconstruction and proposal retain their labels. Previews use fictional data and do not execute payments. A reconstruction never becomes evidence of an observed product.

## Validation

Before integration: generate tokens, run ds:check and build; inspect md/lg heights, radii, one h1, 4/8 px gaps within groups, 16 px between groups and 24 px between sections. Test focus, field errors, modals and mobile width. Visual changes remain subject to preview review.

## Loading and transitions

Skeleton preserves the content shape and appears only while real content loads, such as the lazy documentation module. ContentSkeleton offers document/table variants and a loading announcement; decorative blocks are aria-hidden. Synchronous navigation uses a subtle 140 ms entry without artificial waiting. Respect prefers-reduced-motion.

Button accepts loading and loadingLabel for asynchronous actions: it preserves width and height, shows Spinner and aria-busy, and blocks repeated activation. Loading belongs on native buttons; asChild links use normal navigation. Spinner must not replace final outcomes or hide failure. The 1.4 s demonstration is labeled as a local simulation. A processing payment retains its operational state independently of the submission spinner.

## Available catalog

Primitives and patterns are implemented on individual pages. Availability derives from the registry and existing files. Components still need contextual validation when composing the solution; they are not a validated product flow.

## Density and hierarchy reference

Reference: [Carbon — Typography / productive type set](https://www.carbondesignsystem.com/building-blocks/foundations/typography/type-sets). Carbon distinguishes productive interfaces, with a 14 px base and fixed headings, from expressive pages. This case applies that principle to work screens while retaining its own tokens.

Applied scale: page 20/28; section 16/24; group 14/20; reading 14/20; UI 14/20; supporting text 12/16. Heading weight 700 is a case decision. Display 32/40 stays in presentations. Do not attribute these tokens to OpenAI or Clara's official DS.

Page headers contain a functional title, optional description 4 px away, primary and secondary actions, and a kebab menu when needed. Avoid a top bar repeating the documentation name. Do not render actions without a contextual function. One h1 per page; PageHeader previews use h2.

## Catalog, code and components

The sidebar groups Actions, Forms, Navigation, Data and flow, Feedback and Structure, with search and child items. Each component has its own route, preview, public import, relevant usage example and source code loaded on demand. Registry and code determine availability; a roadmap does not replace implementation.

Dropdown supports keyboard/Escape and returns focus; disabled items remain unavailable. Checkbox selects, RadioGroup chooses one option and Switch changes a preference. Combobox filters and supports keyboard selection. Chip toggles or removes filters with an accessible name. Line and pill tabs share behavior and differ in presentation.

Sonner provides transient feedback; important errors remain beside the data on the page. One Toaster instance per application. Button link executes an action; Button asChild with an anchor and href navigates. Appearance does not replace semantics.

ScrollArea has a transparent track and Slate 300 thumb, 4 px inside an 8 px area, without automatic system-theme changes. Page and sidebar scrolling use Radix; auxiliary areas have a neutral fallback. Preserve keyboard, focus and natural scrolling.

ReviewSummary, Stepper, Timeline and Receipt are case proposals. Internal approval does not establish settlement. Receipt previews are not valid bank documents. FileUpload validates type/size and keeps the file local.

Button examples use cards for Variants, Sizes and states, Loading and Links. Examples, Code and API/contract are related views rather than repeated metadata blocks.

Integration tabs appear directly on the page. Do not wrap tabs and code in a bordered or shadowed card: the code block's neutral background defines that content. Cards are reserved for groups of examples.

An isolated component preview has no external card. Containers belong to the demonstrated component or separate example groups. First- and second-level navigation use 14/20 text; grouping, indentation and selection express hierarchy. Reserve 16 px on the sidebar's scroll side. The DS page uses available width with 16 px gutters, rather than centered max-width whitespace.

## Documentation organization and coverage

Documentation follows Atlassian's separation of [examples, code and usage guidance](https://atlassian.design/components/button/examples). One sentence explains purpose; examples show behavior; code loads on demand. This case does not adopt Atlassian's identity or components. Base Web was considered as a reference, but its page did not render in this environment.

The audit migrated local image, search, tile and slide controls to Pressable, and preview/Markdown tables to Table. Checks block native controls and direct imports in the hub, DS documentation and prototype consumers, plus literal fonts, radii and colors in four authored CSS files. This alone does not validate all layouts or interaction states: page compositions and styles remain local and need review. Generating the registry does not establish full compliance.

With Nunito Sans, control text and menu items use 14/20. Select, dropdown and combobox share this legible scale; medium triggers are 32 px and options have a 32 px minimum height. Legibility does not require enlarging every container.

## Sheet, empty states and upload

Switch uses one thumb-displacement mechanism: 16 px at the default size (36×20), and 12 px at the small size (28×16). Do not combine the CSS utility translate with the token transform.

Sheet organizes Header, scrollable body and Footer; outer padding is 16 px without repeating Header padding. The body has its own scroll and thumb clearance. The close button has a 32 px area and does not overlap the title.

PageHeader supports plain/subtle/brand tones. Subtle color defines context without adding shadows or repeating titles. EmptyState offers plain/card with restrained icons. FileUpload offers compact/dropzone; the dropzone reuses EmptyState in a card, supports keyboard selection and drag/drop, validates type/size and keeps files local. Return links use Button ghost asChild with href.

## Banner and fields with icons

Banner communicates context with title, description, actions and optional visual. Variants: neutral/brand. Body is 4 px from the title; actions are 8 px from content; padding and card radius are 16 px. Composition reference: automatic-payments banner in the demo overview. This component is a case proposal rather than observed-product evidence.

InputGroup integrates Input, icon and an optional action. The icon is 16 px, sits 8 px from text and has 8 px outer padding. Medium32/large40; a single outline and group focus. Screen filtering and global search consume InputGroup. Do not style inputs through local search wrappers; change the DS component/tokens instead.

The hub sidebar identity is Clara Case / Product Finance. Navigation labels stay on one line with 8 px horizontal padding. Avoid redundant descriptions beside the author's role. Search checks also reject old input/icon/action overrides in `.library-search`; browser width and text wrapping still require inspection.

## Proposed workspace composition

Prototype and Solution consume the public DS API and share its tokens. The workspace has sidebar, header, PageHeader, working content and separate test controls. Payment review groups recipient, amount and source; company approval and bank authorization remain distinct. Simulation context belongs in the case documentation and test controls, rather than the product screens. `npm test` verifies state-machine invariants; it does not replace contextual usability checks.

Heading weights are registry tokens (`--weight-h1/h2/h3`), currently 700. Body remains 400 and UI text 500; page-specific styles must not flatten that hierarchy.

## Workspace navigation and page context

The proposed workspace has one page header containing title and related actions. Do not add a company/context bar above it or repeat company metadata in the sidebar. Sidebar supports expanded labels or an icon rail, preserving accessible names, selected state and tooltips. Collapse controls use the shared Button and explicit expanded state. Mobile navigation remains a Sheet with labels.

Sidebar navigation aligns icons and labels to the left. The collapse control sits to the right of the logo when expanded and floats over the sidebar boundary only when collapsed, outside navigation flow, with a 16 px icon in a 32 px DS icon button. Tooltip triggers may override data-slot; navigation layout must target the semantic button element.
