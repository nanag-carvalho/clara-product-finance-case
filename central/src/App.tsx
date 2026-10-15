import { Card, CardContent } from '@/design-system'
import { Pressable } from '@/design-system'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import type { ComponentType } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CaretRight,
  ArrowSquareOut,
  FileText,
  FolderOpen,
  Images,
  House,
  Stack,
  List,
  Sidebar,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import {
  ScrollArea,
  Toaster,
  TooltipProvider,
  ContentSkeleton,
  PageHeader,
} from '@/design-system'
import { BrandMark } from '@/design-system'
import { Button } from '@/design-system'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/design-system'
import { InputGroup } from '@/design-system'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/design-system'
import { Separator } from '@/design-system'
import { EvidenceBadge } from '@/design-system'
import research from '@/data/research.json'
import { screens, type Screen, type Evidence } from '@/data/library'

const Solution = lazy(() => import('./Solution'))
const ResearchMarkdown = lazy(() => import('./ResearchMarkdown'))

type Route =
  | 'overview'
  | 'product'
  | 'desk-research'
  | 'discovery'
  | 'process'
  | 'approach'
  | 'briefing'
  | 'as-is'
  | 'screens'
  | 'sources'
  | 'solution'
  | 'system'
type Icon = ComponentType<{ size?: number; className?: string }>
const groups: {
  label: string
  items: { id: Route; label: string; icon: Icon }[]
}[] = [
  {
    label: 'THE CASE',
    items: [
      { id: 'overview', label: 'Overview', icon: House },
      { id: 'briefing', label: 'Brief and scope', icon: FileText },
    ],
  },
  {
    label: 'DISCOVERY',
    items: [
      { id: 'product', label: 'Product context', icon: Stack },
      { id: 'as-is', label: 'Current journey', icon: BookOpen },
      { id: 'discovery', label: 'User needs and jobs', icon: BookOpen },
      { id: 'desk-research', label: 'Desk research', icon: MagnifyingGlass },
    ],
  },
  {
    label: 'DESIGN AND DELIVERY',
    items: [
      { id: 'approach', label: 'Solution and prototype', icon: Stack },
      { id: 'system', label: 'Design system', icon: Sidebar },
      { id: 'process', label: 'Contribution and AI', icon: FileText },
    ],
  },
  {
    label: 'SUPPORTING EVIDENCE',
    items: [
      { id: 'screens', label: 'Screen library', icon: Images },
      { id: 'sources', label: 'Sources and gaps', icon: FolderOpen },
    ],
  },
]
const nextSteps: Partial<Record<Route, { route: Route; label: string }>> = {
  briefing: { route: 'product', label: 'Understand the product context' },
  product: { route: 'as-is', label: 'Inspect the current journey' },
  'as-is': { route: 'discovery', label: 'Connect the journey to user needs' },
  discovery: { route: 'desk-research', label: 'Compare relevant references' },
  'desk-research': { route: 'approach', label: 'See the solution approach' },
  approach: { route: 'system', label: 'Inspect the shared design foundation' },
  solution: { route: 'system', label: 'Inspect the shared design foundation' },
  system: { route: 'process', label: 'Review process and contributions' },
  process: { route: 'sources', label: 'Review evidence and remaining gaps' },
}
const navItems = groups.flatMap((g) => g.items)
const section = (title: string) => research.find((s) => s.title === title)!
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en-US')
const matches = (text: string, query: string) =>
  normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => normalize(text).includes(term))
const canonicalRoute = (value: string) =>
  ['wireflow', 'solution'].includes(value)
    ? 'approach'
    : ['opportunities', 'decisions', 'proposed-journey', 'userflow'].includes(
          value,
        )
      ? 'approach'
      : value
const initialRoute = (): Route => {
  const value = canonicalRoute(
    window.location.hash.replace('#/', '').split('?')[0],
  )
  return navItems.some((n) => n.id === value) ? (value as Route) : 'overview'
}

function Tag({ kind }: { kind: Evidence }) {
  return <EvidenceBadge kind={kind} />
}
function PageHeading({
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <>
      <PageHeader title={title} description={description} actions={children} />
      <Separator className="page-content-divider" />
    </>
  )
}

export default function App() {
  const [route, setRoute] = useState<Route>(initialRoute)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selected, setSelected] = useState<Screen | null>(null)
  const [filter, setFilter] = useState('All')
  const [docTab, setDocTab] = useState('journey')
  const [sourceTab, setSourceTab] = useState('coverage')
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const handler = () => {
      setRoute(initialRoute())
      setMobileOpen(false)
      document
        .querySelector('.central-page-scroll [data-slot=scroll-area-viewport]')
        ?.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  useEffect(() => {
    document.title = `${navItems.find((n) => n.id === route)?.label} · Clara case`
  }, [route])
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [route, searchOpen, selected])
  const go = (id: Route) => {
    setRoute(canonicalRoute(id) as Route)
    window.location.hash = `/${canonicalRoute(id)}`
    setMobileOpen(false)
    document
      .querySelector('.central-page-scroll [data-slot=scroll-area-viewport]')
      ?.scrollTo(0, 0)
  }
  const openImage = (file: string, alt: string) =>
    setSelected(
      file.startsWith('/proposal/')
        ? {
            id: file,
            file,
            title: alt,
            area: 'Proposed experience',
            kind: 'Reconstruction',
            note: 'Screenshot of the authored prototype with fictional data. This is a proposed interface, not an observed Clara screen.',
          }
        : screens.find((s) => s.file === file) || {
            id: file,
            file,
            title: alt,
            area: 'Documentation',
            kind: file.endsWith('.svg') ? 'Reconstruction' : 'Official',
            note: file.endsWith('.svg')
              ? 'Authored diagram. Read the caption for its basis: brief reconstruction or proposed experience; not an observed product screen.'
              : 'Image preserved in the source documentation. See the source beside the text.',
          },
    )
  const sidebar = (
    <div className="sidebar-inner">
      <a
        className="brand case-brand case-brand-lockup"
        href="#/overview"
        aria-label="Clara Case — overview"
        onClick={() => go('overview')}
      >
        <BrandMark wordmark />
        <span className="brand-sub">Case · Product Finance</span>
      </a>
      <Separator />
      <ScrollArea className="central-nav-scroll">
        <nav aria-label="Main navigation">
          {groups.map((g) => (
            <div className="nav-group" key={g.label}>
              <p>{g.label}</p>
              {g.items.map((item) => (
                <React.Fragment key={item.id}>
                  <a
                    href={`#/${item.id}`}
                    aria-current={route === item.id ? 'page' : undefined}
                    className={`nav-link ${route === item.id ? 'active' : ''}`}
                    onClick={() => go(item.id)}
                  >
                    <item.icon size={17} />
                    <span>{item.label}</span>
                    {route === item.id && <span className="active-dot" />}
                  </a>
                  {item.id === 'as-is' && route === 'as-is' && (
                    <div className="case-subnav">
                      {[
                        ['journey', 'Journey overview'],
                        ['creation', 'Creation and validation'],
                        ['approval', 'Approvals'],
                        ['execution', 'Execution and receipt'],
                        ['audit', 'Critical audit'],
                      ].map(([id, label]) => (
                        <Button
                          key={id}
                          variant="ghost"
                          aria-current={docTab === id ? 'page' : undefined}
                          onClick={() => {
                            setDocTab(id)
                            document
                              .querySelector(
                                '.central-page-scroll [data-slot=scroll-area-viewport]',
                              )
                              ?.scrollTo(0, 0)
                          }}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
      <div className="sidebar-bottom">
        <Separator />
        <div className="author">
          <span className="avatar">NC</span>
          <div>
            <strong>Nágela Carvalho</strong>
            <span>Design Engineer</span>
          </div>
        </div>
      </div>
    </div>
  )
  function Reader({
    titles,
    omitLeadHeading = false,
  }: {
    titles: string[]
    omitLeadHeading?: boolean
  }) {
    const entries = titles.map(section).filter(Boolean)
    return (
      <div className="reader-layout">
        <article className="prose">
          {entries.map((s, index) => (
            <section key={s.id} id={s.id}>
              {!(omitLeadHeading && index === 0) && <h2>{s.title}</h2>}
              <Suspense
                fallback={<ContentSkeleton label="Loading documentation" />}
              >
                <ResearchMarkdown
                  body={s.body}
                  onImage={openImage}
                  promoteHeadings={omitLeadHeading && index === 0}
                />
              </Suspense>
            </section>
          ))}
        </article>
        <aside className="reader-toc">
          <p className="eyebrow">ON THIS PAGE</p>
          {entries.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById(s.id)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {s.title}
            </a>
          ))}
        </aside>
      </div>
    )
  }
  const officialSources = Array.from(
    new Map(
      research
        .flatMap((s) =>
          Array.from(
            s.body.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g),
          ).map((m) => ({ title: m[1], url: m[2] })),
        )
        .map((s) => [s.url, s]),
    ).values(),
  )
  const visibleScreens = screens.filter(
    (s) =>
      (filter === 'All' || s.kind === filter) &&
      matches(`${s.title} ${s.area} ${s.note}`, query),
  )
  const results = [
    ...navItems.map((n) => ({
      title: n.label,
      subtitle: 'Hub section',
      route: n.id,
    })),
    ...research.map((s) => ({
      title: s.title,
      subtitle: 'Documentation',
      route: ([
        'Discovery: empathy map and user voice',
        'Jobs to be done and decision traceability',
      ].includes(s.title)
        ? 'discovery'
        : [
              'Desk research: three relevant references',
              'UI references and design criteria',
              'Interaction benchmark: Mercury, Nubank and Wise',
            ].includes(s.title)
          ? 'desk-research'
          : [
                'My direction',
                'Proposed flow',
                'Hypotheses and validation',
              ].includes(s.title)
            ? 'approach'
            : [
                  'Brazil constraints and feasible scope',
                  'Two-day delivery plan',
                ].includes(s.title)
              ? 'briefing'
              : [
                    'AI work log',
                    'Design and engineering contributions',
                    'Prototype implementation and comparison',
                  ].includes(s.title)
                ? 'process'
                : s.title === 'Visual and interaction direction'
                  ? 'system'
                  : s.title === 'Product context and the brief'
                    ? 'product'
                    : s.title === 'Brief and evaluation criteria'
                      ? 'briefing'
                      : [
                            'Audit-driven interface decisions',
                            'A design system that AI can use',
                          ].includes(s.title)
                        ? 'system'
                        : [
                              'Reference recency',
                              'AI work log',
                              'State coverage and reconstructions for validation',
                            ].includes(s.title)
                          ? 'sources'
                          : 'as-is') as Route,
      sectionId: [
        'My direction',
        'Proposed flow',
        'Hypotheses and validation',
      ].includes(s.title)
        ? 'solution-prototype'
        : s.id,
    })),
    ...screens.map((s) => ({
      title: s.title,
      subtitle: `${s.kind} · ${s.area}`,
      route: 'screens' as Route,
      screen: s,
    })),
  ]
    .filter((s) => matches(`${s.title} ${s.subtitle}`, query))
    .slice(0, 12)

  return (
    <TooltipProvider>
      <div className="app-shell">
        <a
          href="#main"
          className="skip-link"
          onClick={(e) => {
            e.preventDefault()
            mainRef.current?.focus()
            mainRef.current?.scrollIntoView()
          }}
        >
          Skip to content
        </a>
        <aside className="sidebar">{sidebar}</aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="breadcrumb">
              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <List size={18} />
              </Button>
              <span>Case hub</span>
              <CaretRight size={14} />
              <strong>{navItems.find((n) => n.id === route)?.label}</strong>
            </div>
            <div className="topbar-actions">
              <Button
                variant="outline"
                className="search-trigger"
                aria-label="Search the hub"
                onClick={() => {
                  setQuery('')
                  setSearchOpen(true)
                }}
              >
                <MagnifyingGlass size={15} />
                <span>Search the hub</span>
                <kbd>⌘ K</kbd>
              </Button>
              <span className="topbar-draft">
                <span />
                Case study
              </span>
            </div>
          </header>
          <ScrollArea className="central-page-scroll" key={route}>
            <main
              key={route}
              id="main"
              ref={mainRef}
              tabIndex={-1}
              className="main-content"
            >
              {route === 'overview' && (
                <>
                  <PageHeading
                    eyebrow="NÁGELA CARVALHO / DESIGN ENGINEER"
                    title="Clara · Product Finance case"
                    description="Nágela Carvalho · Design reasoning, interaction exploration and implementation."
                  ></PageHeading>
                  <div className="overview-hero">
                    <div className="hero-copy">
                      <p className="eyebrow">THE CHALLENGE</p>
                      <h2>
                        Pay through Clara.
                        <br />
                        With funds from
                        <br />
                        <em>another bank.</em>
                      </h2>
                      <p>
                        How can I reduce the finance team's effort while
                        preserving approvals, context and traceability?
                      </p>
                      <Button asChild>
                        <a
                          href="/showcase.html"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Explore the showcase <ArrowUpRight size={16} />
                        </a>
                      </Button>
                      <span className="hero-caption">
                        Open Finance · Pix · Business account
                      </span>
                    </div>
                    <div className="hero-visual">
                      <div className="visual-top">
                        <span className="live-dot" />
                        OBSERVED PRODUCT{' '}
                        <span className="visual-number">01—06</span>
                      </div>
                      <Pressable
                        className="hero-screenshot"
                        onClick={() =>
                          openImage(
                            'assets/06-pagamentos.png',
                            'Payments overview',
                          )
                        }
                      >
                        <img
                          src="/research/assets/06-pagamentos.png"
                          alt="Payments screen in the Clara demo"
                        />
                        <span>
                          Payments <ArrowUpRight size={16} />
                        </span>
                      </Pressable>
                      <div className="visual-footer">
                        <Tag kind="Demo" />
                        <span>The starting point of the flow</span>
                      </div>
                    </div>
                  </div>
                  <section className="overview-authorship">
                    <p className="eyebrow">THE THREAD THROUGH THIS CASE</p>
                    <h2>From design intention to working behavior.</h2>
                    <p>
                      I connected the financial task to interaction choices,
                      visual hierarchy and reusable code. Follow why I changed
                      the payment entry, how I used brand feedback to bring care
                      to the transition, and how I carried those decisions into
                      shared components and checks.
                    </p>
                    <Button variant="link" onClick={() => go('process')}>
                      Follow my design and engineering decisions{' '}
                      <ArrowRight size={16} />
                    </Button>
                  </section>
                  <div className="section-heading">
                    <h2>Explore the case</h2>
                    <span>Evidence → decisions → experience</span>
                  </div>
                  <div className="area-grid">
                    {[
                      {
                        n: '01',
                        title: 'Documentation',
                        desc: 'Brief, current journey, references and product decisions.',
                        icon: BookOpen,
                        to: 'as-is',
                        status: 'Research foundation',
                      },
                      {
                        n: '02',
                        title: 'Design decisions',
                        desc: 'My reasoning about the problem, alternatives and decisions.',
                        icon: FileText,
                        to: 'process',
                        status: 'Design and engineering contribution',
                      },
                      {
                        n: '03',
                        title: 'Proposed solution',
                        desc: 'Flow exploration, design and prototype.',
                        icon: Stack,
                        to: 'solution',
                        status: 'Interactive exploration',
                      },
                    ].map((area) => (
                      <a
                        key={area.n}
                        href={`#/${area.to}`}
                        className="area-card-link"
                      >
                        <Card className="area-card">
                          <CardContent>
                            <div className="area-card-top">
                              <area.icon size={21} />
                              <span>{area.n}</span>
                            </div>
                            <h3>{area.title}</h3>
                            <p>{area.desc}</p>
                            <div className="area-card-bottom">
                              <span>{area.status}</span>
                              <ArrowUpRight size={20} aria-hidden="true" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                  <div className="bottom-grid">
                    <div className="next-step">
                      <span className="step-line" />
                      <p className="eyebrow">MY CONTRIBUTION</p>
                      <h3>From product reasoning to a working system.</h3>
                      <p>
                        I defined the funding entry and recovery, designed
                        shared patterns, and implemented typed transitions with
                        repeatable checks.
                      </p>
                      <Button variant="link" onClick={() => go('process')}>
                        See decisions and implementation{' '}
                        <ArrowRight size={15} />
                      </Button>
                    </div>
                    <div className="evidence-summary">
                      <h3>Evidence behind the case</h3>
                      {[
                        [
                          'Demo',
                          'Screenshots I captured from the demo and Arc session',
                        ],
                        ['Official', 'Images and guides published by Clara'],
                        [
                          'Reconstruction',
                          'Uncaptured states marked for validation',
                        ],
                      ].map(([kind, text]) => (
                        <div key={kind}>
                          <Tag kind={kind as Evidence} />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {route === 'product' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / PRODUCT"
                    title="Product context"
                    description="Clara’s positioning, the financial work it supports and the context behind the brief."
                  />
                  <Reader
                    omitLeadHeading
                    titles={['Product context and the brief']}
                  />
                </>
              )}
              {route === 'discovery' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / DISCOVERY"
                    title="User understanding and jobs"
                    description="A provisional empathy map, the job behind the payment and the evidence I still need from users and the business."
                  />
                  <Reader
                    omitLeadHeading
                    titles={[
                      'Discovery: empathy map and user voice',
                      'Jobs to be done and decision traceability',
                    ]}
                  />
                </>
              )}
              {route === 'desk-research' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / RESEARCH"
                    title="Desk research"
                    description="Competitor context and an evidence-based benchmark for payment interactions."
                  />
                  <Reader
                    omitLeadHeading
                    titles={[
                      'Desk research: three relevant references',
                      'UI references and design criteria',
                      'Interaction benchmark: Mercury, Nubank and Wise',
                    ]}
                  />
                </>
              )}
              {route === 'briefing' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / 01"
                    title="Brief and scope"
                    description="The user context, proposed problem and evaluation criteria."
                  />
                  <div className="context-strip">
                    {[
                      ['200', 'employees in the company'],
                      ['2', 'traditional banks'],
                      ['Pix', 'supplier payments'],
                      ['45 min', 'walkthrough and discussion'],
                    ].map(([value, label]) => (
                      <div key={label}>
                        <strong>{value}</strong>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <Reader
                    omitLeadHeading
                    titles={[
                      'Brief and evaluation criteria',
                      'Brazil constraints and feasible scope',
                      'Two-day delivery plan',
                    ]}
                  />
                  <div className="inline-note">
                    <FileText size={19} />
                    <p>
                      I started with the interview brief; the company and
                      finance manager's context comes from that material.
                    </p>
                  </div>
                </>
              )}
              {route === 'as-is' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / 02"
                    title="The current experience"
                    description="Observed behavior, my critical audit and the evidence behind it."
                  />
                  <Tabs value={docTab} onValueChange={setDocTab}>
                    <TabsList className="section-tabs journey-tabs">
                      <TabsTrigger value="journey">Journey</TabsTrigger>
                      <TabsTrigger value="creation">
                        Creation and validation
                      </TabsTrigger>
                      <TabsTrigger value="approval">Approvals</TabsTrigger>
                      <TabsTrigger value="execution">
                        Execution and receipt
                      </TabsTrigger>
                      <TabsTrigger value="audit">Critical audit</TabsTrigger>
                    </TabsList>
                    <TabsContent value="journey">
                      <Reader
                        titles={[
                          'Current journey and evidence coverage',
                          'Payments as the entry point',
                          'Other demo screens',
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="audit">
                      <Reader
                        titles={['Critical audit of the current experience']}
                      />
                    </TabsContent>
                    <TabsContent value="creation">
                      <Reader
                        titles={[
                          'Payment creation and validation',
                          'Email code confirmation',
                          'Suppliers in the 2026 documentation',
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="approval">
                      <Reader
                        titles={[
                          'Approving a request',
                          'Approval workflow configuration',
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="execution">
                      <Reader
                        titles={[
                          'Existing execution and failure states',
                          'Pix receipt and transaction traceability',
                          'Operational volume and batch Pix',
                        ]}
                      />
                    </TabsContent>
                  </Tabs>
                </>
              )}
              {route === 'screens' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / LIBRARY"
                    title="Screens and flow states"
                    description="A searchable collection of visual evidence and diagrams for validation."
                  />
                  <div className="library-toolbar">
                    <Tabs value={filter} onValueChange={setFilter}>
                      <TabsList>
                        {['All', 'Demo', 'Official', 'Reconstruction'].map(
                          (f) => (
                            <TabsTrigger key={f} value={f}>
                              {f === 'Official'
                                ? 'Official'
                                : f === 'Reconstruction'
                                  ? 'Reconstructions'
                                  : f}
                            </TabsTrigger>
                          ),
                        )}
                      </TabsList>
                    </Tabs>
                    <InputGroup
                      className="library-search"
                      leadingIcon={<MagnifyingGlass size={16} />}
                      aria-label="Filter screens"
                      placeholder="Filter screens…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      trailing={
                        query ? (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Clear filter"
                            onClick={() => setQuery('')}
                          >
                            <X size={14} />
                          </Button>
                        ) : undefined
                      }
                    />
                  </div>
                  <div className="library-count">
                    {visibleScreens.length}{' '}
                    {visibleScreens.length === 1 ? 'reference' : 'references'}{' '}
                    <span>
                      Open a screen to view its source and limitations.
                    </span>
                  </div>
                  <div className="screen-grid">
                    {visibleScreens.map((screen) => (
                      <Pressable
                        className="screen-card"
                        key={screen.id}
                        onClick={() => setSelected(screen)}
                      >
                        <div
                          className={`screen-preview ${screen.kind === 'Reconstruction' ? 'reconstructed' : ''}`}
                        >
                          <img
                            src={`/research/${screen.file}`}
                            alt={screen.title}
                            loading="lazy"
                          />
                          <span className="expand-icon">
                            <ArrowUpRight size={17} />
                          </span>
                        </div>
                        <div className="screen-card-body">
                          <Tag kind={screen.kind} />
                          <h3>{screen.title}</h3>
                          <p>{screen.area}</p>
                        </div>
                      </Pressable>
                    ))}
                  </div>
                  {visibleScreens.length === 0 && (
                    <div className="empty-state">
                      <MagnifyingGlass size={32} />
                      <h3>No screens found</h3>
                      <p>Try another term or remove the filter.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuery('')
                          setFilter('All')
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </>
              )}
              {route === 'sources' && (
                <>
                  <PageHeading
                    eyebrow="DOCUMENTATION / EVIDENCE"
                    title="Sources and gaps"
                    description="What I observed, what I still need to investigate and the sources behind my analysis."
                  />
                  <Tabs value={sourceTab} onValueChange={setSourceTab}>
                    <TabsList className="section-tabs">
                      <TabsTrigger value="coverage">State coverage</TabsTrigger>
                      <TabsTrigger value="links">Sources consulted</TabsTrigger>
                      <TabsTrigger value="context">
                        Recency and process
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="coverage">
                      <Reader
                        titles={[
                          'State coverage and reconstructions for validation',
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="links">
                      <div className="source-list">
                        {officialSources.map((s, i) => (
                          <a
                            key={s.url}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <span className="source-index">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <h3>{s.title}</h3>
                              <p>{new URL(s.url).hostname}</p>
                            </div>
                            <ArrowSquareOut size={17} />
                          </a>
                        ))}
                      </div>
                      <a
                        className="download-source"
                        href="/research/asset-sources.json"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open the image source register{' '}
                        <ArrowUpRight size={14} />
                      </a>
                    </TabsContent>
                    <TabsContent value="context">
                      <Reader titles={['Reference recency']} />
                    </TabsContent>
                  </Tabs>
                </>
              )}
              {route === 'process' && (
                <>
                  <PageHeading
                    eyebrow="PROCESS"
                    title="Contribution and AI"
                    description="How my product reasoning, interaction direction and technical requirements shaped the experience—with a record of AI assistance."
                  />
                  <Reader
                    omitLeadHeading
                    titles={[
                      'Design and engineering contributions',
                      'Prototype implementation and comparison',
                      'AI work log',
                    ]}
                  />
                </>
              )}
              {route === 'approach' && (
                <>
                  <PageHeading
                    eyebrow="DESIGN AND DELIVERY"
                    title="Solution and prototype"
                    description="A supplier Pix from Clara, using funds held at an external bank."
                  >
                    <Button asChild>
                      <a
                        href="/prototype.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open prototype
                        <ArrowUpRight size={16} />
                      </a>
                    </Button>
                  </PageHeading>
                  <div className="reader-layout case-solution-layout">
                    <div className="case-solution-content">
                      <p className="type-ui">
                        The showcase introduces the story; here I explain how
                        each decision works. Start with the source and first
                        connection, then follow the payment through review,
                        approval and recovery.
                      </p>
                      <Suspense
                        fallback={
                          <ContentSkeleton label="Loading proposed experience" />
                        }
                      >
                        <Solution onImage={openImage} />
                      </Suspense>
                    </div>
                    <aside className="reader-toc" aria-label="On this page">
                      <p className="eyebrow">ON THIS PAGE</p>
                      {[
                        ['Payment entry', 'solution-entry'],
                        ['First connection', 'solution-connection'],
                        ['Operational overview', 'solution-overview'],
                        ['Payment queue · before and after', 'solution-volume'],
                        ['Progress and history', 'solution-tracking'],
                        ['Correction and recovery', 'solution-recovery'],
                      ].map(([label, id]) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          onClick={(event) => {
                            event.preventDefault()
                            document.getElementById(id)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            })
                          }}
                        >
                          {label}
                        </a>
                      ))}
                    </aside>
                  </div>
                </>
              )}
              {route === 'solution' && (
                <>
                  <PageHeading
                    eyebrow="PROPOSED SOLUTION"
                    title="Design and prototype"
                    description="The brief-defined Pix experience: external-bank funds, connection, approval, authorization and recovery."
                  />
                  <Suspense
                    fallback={
                      <ContentSkeleton label="Loading proposed experience" />
                    }
                  >
                    <Solution onImage={openImage} />
                  </Suspense>
                </>
              )}
              {route === 'system' && (
                <>
                  <PageHeading
                    eyebrow="CASE FOUNDATION"
                    title="Design system for AI-assisted work"
                    description="Reusable design decisions, a public component API and checks for consistent implementation."
                  >
                    <Button asChild>
                      <a
                        href="/design-system.html"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open design system
                        <ArrowUpRight size={16} />
                      </a>
                    </Button>
                  </PageHeading>
                  <Reader
                    titles={[
                      'Visual and interaction direction',
                      'A design system that AI can use',
                      'Audit-driven interface decisions',
                    ]}
                  />
                </>
              )}
              {nextSteps[route] && (
                <div className="case-next-step">
                  <span className="type-caption">Next in the case</span>
                  <Button
                    variant="outline"
                    onClick={() => go(nextSteps[route]!.route)}
                  >
                    {nextSteps[route]!.label}
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
              <footer className="page-footer">
                <span>Clara · Product Finance case study</span>
                <span>Independent case by Nágela Carvalho · 2026</span>
              </footer>
            </main>
          </ScrollArea>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="mobile-sidebar">
            <SheetTitle className="sr-only">Hub navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Research, design decisions and proposed solution
            </SheetDescription>
            {sidebar}
          </SheetContent>
        </Sheet>
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="search-dialog">
            <DialogHeader>
              <DialogTitle>Search the hub</DialogTitle>
              <DialogDescription>
                Find sections, documentation topics and visual references.
              </DialogDescription>
            </DialogHeader>
            <InputGroup
              leadingIcon={<MagnifyingGlass size={16} />}
              autoFocus
              aria-label="Global search"
              placeholder="E.g. approval, Pix, receipt…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="search-results">
              {results.map((result, i) => (
                <Pressable
                  key={`${result.title}-${i}`}
                  onClick={() => {
                    setSearchOpen(false)
                    go(result.route)
                    setQuery('')
                    if ('screen' in result) setSelected(result.screen as Screen)
                    if ('sectionId' in result) {
                      const title = result.title
                      setDocTab(
                        [
                          'Payment creation and validation',
                          'Email code confirmation',
                          'Suppliers in the 2026 documentation',
                        ].includes(title)
                          ? 'creation'
                          : [
                                'Approving a request',
                                'Approval workflow configuration',
                              ].includes(title)
                            ? 'approval'
                            : [
                                  'Existing execution and failure states',
                                  'Pix receipt and transaction traceability',
                                  'Operational volume and batch Pix',
                                ].includes(title)
                              ? 'execution'
                              : title ===
                                  'Critical audit of the current experience'
                                ? 'audit'
                                : 'journey',
                      )
                      setSourceTab(
                        title ===
                          'State coverage and reconstructions for validation'
                          ? 'coverage'
                          : 'context',
                      )
                      setTimeout(
                        () =>
                          document
                            .getElementById(String(result.sectionId))
                            ?.scrollIntoView({ behavior: 'smooth' }),
                        200,
                      )
                    }
                  }}
                >
                  <MagnifyingGlass size={16} />
                  <div>
                    <strong>{result.title}</strong>
                    <span>{result.subtitle}</span>
                  </div>
                  <ArrowUpRight size={16} />
                </Pressable>
              ))}
              {results.length === 0 && <p>No results. Try another term.</p>}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null)
          }}
        >
          <DialogContent className="image-dialog">
            <DialogHeader>
              <DialogTitle>{selected?.title}</DialogTitle>
              <DialogDescription>{selected?.note}</DialogDescription>
            </DialogHeader>
            {selected && (
              <>
                <div className="image-detail-meta">
                  <Tag kind={selected.kind} />
                  <span>{selected.area}</span>
                </div>
                <div className="image-detail-view">
                  <img
                    src={
                      selected.file.startsWith('https://') ||
                      selected.file.startsWith('/')
                        ? selected.file
                        : `/research/${selected.file}`
                    }
                    alt={selected.title}
                  />
                </div>
                <div className="image-detail-actions">
                  <Button variant="outline" asChild>
                    <a
                      href={
                        selected.file.startsWith('https://') ||
                        selected.file.startsWith('/')
                          ? selected.file
                          : `/research/${selected.file}`
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open original <ArrowUpRight size={15} />
                    </a>
                  </Button>
                  {selected.source && (
                    <Button variant="ghost" asChild>
                      <a
                        href={selected.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View source <ArrowSquareOut size={14} />
                      </a>
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
