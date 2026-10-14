import { scenarioOptions } from './prototype/scenarios'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import {
  Badge,
  BrandLoading,
  BrandMark,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/design-system'
import ResearchMarkdown from './ResearchMarkdown'

type ImageHandler = (file: string, alt: string) => void

export function BusinessRationale() {
  return (
    <section
      id="story-business"
      className="showcase-panel showcase-panel-dark"
      tabIndex={-1}
    >
      <p className="eyebrow">02 · BUSINESS OPPORTUNITY</p>
      <div className="showcase-chapter-heading">
        <h2>Give customers a reason to keep paying through Clara.</h2>
        <p>
          Open Finance was the route proposed in the brief. I focused on what
          would make it useful in the existing operation: paying from another
          bank while keeping the request, company review and payment history
          together in Clara.
        </p>
      </div>
      <p className="showcase-editorial-note">
        Removing the top-up could reduce preparation for the finance team and
        make Clara useful for payments that would otherwise happen elsewhere.
        That is the adoption opportunity I would evaluate alongside task effort.
        I kept the scope to one supplier Pix; the exception scenarios explore
        that same job. Bulk creation and real bank integration remain outside
        this prototype.
      </p>
    </section>
  )
}

export function ProcessRationale() {
  return (
    <section id="story-process" tabIndex={-1}>
      <p className="eyebrow">04 · MY PROCESS</p>
      <div className="showcase-chapter-heading">
        <h2>I used each iteration to question the next decision.</h2>
        <p>
          With the funding route defined, I mapped what the person needs to
          decide at each step, including when they leave, return or correct a
          request. I used that map to review the interface as it took shape:
          could someone see what matters and understand what to do next?
        </p>
      </div>
      <p>
        Several early versions worked logically but felt crowded or abrupt. I
        revised the composition and transitions, using proximity, progressive
        disclosure and consistent feedback to keep those decisions in context.
      </p>
      <IterationChoices />
    </section>
  )
}

export function AestheticRationale({ onImage }: { onImage: ImageHandler }) {
  return (
    <section id="story-aesthetic" tabIndex={-1}>
      <p className="eyebrow">06 · VISUAL DIRECTION</p>
      <div className="showcase-chapter-heading">
        <h2>Familiar workspace. Clearer priorities.</h2>
        <p>
          Those changes also needed to belong to Clara. I retained the sidebar
          and payment queue as familiar anchors, then adjusted the hierarchy
          around the funding source, status and available action.
        </p>
      </div>
      <div className="showcase-visual-comparison">
        <figure>
          <figcaption>
            <Badge variant="outline">Observed demo</Badge>
            <h3>The starting point</h3>
            <p>
              The observed screen established the structure and density I needed
              to work with.
            </p>
          </figcaption>
          <ResearchMarkdown
            body="![Observed Clara payment interface](assets/06-pagamentos.png)"
            onImage={onImage}
          />
        </figure>
        <figure>
          <figcaption>
            <Badge variant="outline">My proposal</Badge>
            <h3>Source + status + next action</h3>
            <p>
              The proposal brings the funding source and the next action into
              the same workspace.
            </p>
          </figcaption>
          <ResearchMarkdown
            body="![Proposed Clara payment workspace](/proposal/payments.png)"
            onImage={onImage}
          />
        </figure>
      </div>
      <DesignDecisions />
      <a
        className="showcase-detail-link"
        href="/#/system"
        target="clara-case-hub"
      >
        Visual principles and interaction choices <ArrowUpRight size={16} />
      </a>
    </section>
  )
}

function DesignDecisions() {
  const [previewing, setPreviewing] = useState(false)
  useEffect(() => {
    if (!previewing) return
    const timer = window.setTimeout(() => setPreviewing(false), 650)
    return () => window.clearTimeout(timer)
  }, [previewing])
  return (
    <div className="showcase-design-decisions">
      <div className="showcase-design-strip">
        <div>
          <div
            className="showcase-swatches"
            aria-label="Neutral surfaces and blue emphasis"
          >
            <i />
            <i />
            <i />
          </div>
          <h3>Color gives direction.</h3>
          <p>
            Neutral surfaces support the work. Blue identifies actions and
            selection.
          </p>
        </div>
        <div>
          <div className="showcase-type-sample" aria-hidden="true">
            Aa <small>123</small>
          </div>
          <h3>Hierarchy before decoration.</h3>
          <p>
            Nunito Sans and a compact scale keep amounts, names and next actions
            readable.
          </p>
        </div>
        <div>
          <div className="showcase-spacing-sample" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <h3>Space explains relationships.</h3>
          <p>Related details stay together; decisions get room to stand out.</p>
        </div>
      </div>
      <div className="showcase-motion-decision">
        <div className="showcase-motion-preview">
          <BrandMark />
          {previewing &&
            createPortal(
              <div className="showcase-brand-transition">
                <BrandLoading label="Preparing your payment" />
              </div>,
              document.body,
            )}
        </div>
        <div>
          <span className="eyebrow">BRAND IN THE TRANSITION</span>
          <h3>A moment of care before important details.</h3>
          <p>
            I introduced a brief branded transition to soften the entry into the
            payment. The translucent background keeps the workspace in view; the
            motion brings continuity and a sense of care to a task that asks for
            financial details.
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={previewing}
            onClick={() => setPreviewing(true)}
          >
            Replay the transition
          </Button>
        </div>
      </div>
    </div>
  )
}

export function SharedSystemProof() {
  const [variant, setVariant] = useState<'default' | 'outline' | 'ghost'>(
    'default',
  )
  const [activated, setActivated] = useState(false)
  return (
    <div className="showcase-system-proof">
      <ol
        className="showcase-system-path"
        aria-label="How the shared design system reaches the interface"
      >
        <li>
          <strong>Define</strong>
          <span>Tokens + components</span>
        </li>
        <li>
          <strong>Expose</strong>
          <span>Public API + contract</span>
        </li>
        <li>
          <strong>Reuse</strong>
          <span>Hub · prototype · showcase</span>
        </li>
        <li>
          <strong>Check</strong>
          <span>Types + rules + browser tests</span>
        </li>
      </ol>
      <div className="showcase-component-example">
        <div className="showcase-component-lab">
          <div>
            <p className="eyebrow">LIVE COMPONENT</p>
            <h3>One Button. Three levels of emphasis.</h3>
            <p>Imported from the shared DS. Try a variant.</p>
            <Tabs
              value={variant}
              onValueChange={(value) => {
                setVariant(value as typeof variant)
                setActivated(false)
              }}
            >
              <TabsList aria-label="Button variant">
                <TabsTrigger value="default">Primary</TabsTrigger>
                <TabsTrigger value="outline">Secondary</TabsTrigger>
                <TabsTrigger value="ghost">Quiet</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="showcase-component-preview">
            <Button variant={variant} onClick={() => setActivated(true)}>
              Try shared action <ArrowRight size={16} />
            </Button>
            <p role="status">
              {activated
                ? 'Action received. Same component, selected variant.'
                : 'Try pointer or keyboard.'}
            </p>
          </div>
        </div>
        <pre className="showcase-code">
          <code>{`import { Button } from '@/design-system'\n<Button variant="${variant}" onClick={handleAction}>Continue</Button>`}</code>
        </pre>
      </div>
      <div className="story-actions">
        <Button variant="outline" asChild>
          <a
            href="/design-system.html#/components/button"
            target="clara-case-design-system"
          >
            Examples, code and API <ArrowUpRight size={16} />
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/nanag-carvalho/clara-product-finance-case"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inspect the repository <ArrowUpRight size={16} />
          </a>
        </Button>
        <Button variant="link" asChild>
          <a href="/#/system" target="clara-case-hub">
            Architecture and reuse <ArrowUpRight size={16} />
          </a>
        </Button>
      </div>
      <div className="showcase-contribution showcase-panel showcase-panel-soft">
        <span className="eyebrow">MY DS CONTRIBUTION</span>
        <h3>Make the pattern carry the design decision.</h3>
        <div className="showcase-reasoning-grid">
          <div>
            <h3>Wizard</h3>
            <p>One focused task, with mobile actions kept reachable.</p>
          </div>
          <div>
            <h3>InputGroup</h3>
            <p>An explicit action that moves below the field on mobile.</p>
          </div>
          <div>
            <h3>ReviewSummary</h3>
            <p>Recipient and amount emphasis, with room for long Pix keys.</p>
          </div>
        </div>
        <p>
          To contribute these patterns across markets, I would keep sequence,
          field actions and review hierarchy shared, while leaving Pix formats
          and bank rules in the Brazilian payment layer. The next step would be
          a DS review with localized examples and interaction checks.
        </p>
      </div>
    </div>
  )
}

export function EvaluationGuide() {
  return (
    <div className="showcase-evaluation">
      <div className="showcase-coverage-panel showcase-panel showcase-panel-dark">
        <div className="showcase-coverage-heading">
          <span>{scenarioOptions.length}</span>
          <div>
            <p className="eyebrow">SCENARIOS TO EXPLORE</p>
            <h3>One payment. Different ways forward.</h3>
          </div>
        </div>
        <div className="showcase-scenario-branches">
          <div>
            <div className="showcase-branch-heading">
              <span>5</span>
              <h4>From preparation to payment</h4>
            </div>
            <p>
              First connection · Connected account · Company approval ·
              Authorization · Completed payment
            </p>
          </div>
          <div>
            <div className="showcase-branch-heading">
              <span>7</span>
              <h4>When something needs attention</h4>
            </div>
            <p>
              Rejected request · Canceled confirmation · Expired connection ·
              Insufficient funds · Bank limit · Service failure · Unknown result
            </p>
          </div>
        </div>
        <aside
          className="showcase-explore-instructions"
          aria-label="How to explore the prototype"
        >
          <div>
            <h4>Choose a situation. Follow the next action.</h4>
            <p>
              Each scenario opens a saved state. Use the floating{' '}
              <strong>Scenarios</strong> button to try another.
            </p>
          </div>
          <Button variant="outline" asChild>
            <a
              href="/prototype.html?explore=scenarios"
              target="clara-case-prototype"
            >
              Explore the 12 scenarios <ArrowUpRight size={16} />
            </a>
          </Button>
        </aside>
      </div>
      <div className="showcase-check-summary">
        <h4>
          I checked behavior in code; the next step is evaluating it with
          people.
        </h4>
        <p>
          <strong>40 domain and registry tests</strong> check rules and
          contracts. <strong>16 browser test cases</strong> exercise the
          interface on desktop and mobile, including entry, approval,
          authorization and recovery.
        </p>
        <p className="story-caption">
          31 desktop/mobile runs passed; one mobile-only case is skipped on
          desktop. These checks cover implementation behavior.
        </p>
      </div>
      <p>
        In participant sessions, I would observe whether people choose the right
        source (H1), identify the next actor (H2), recover without duplicates
        (H3) and review the right details (H4). I would measure active handling
        time for a correctly completed payment, recording passive waiting
        separately, to assess whether the new route actually reduces effort.
      </p>
      <a
        className="showcase-detail-link"
        href="/#/process"
        target="clara-case-hub"
      >
        See coverage, tasks and evaluation measures <ArrowUpRight size={16} />
      </a>
      <details className="story-boundaries">
        <summary>Run the checks with the source checkout</summary>
        <pre className="showcase-code">
          <code>{`cd central\nnpm ci\nnpx playwright install chromium\nnpm run verify:full`}</code>
        </pre>
      </details>
    </div>
  )
}

export function JourneyEntry() {
  return (
    <div className="showcase-connection-story showcase-panel showcase-panel-soft">
      <p className="eyebrow">FIRST USE · A DIFFERENT MOMENT OF TRUST</p>
      <h3>Connecting an account is not authorizing every payment.</h3>
      <p>
        I made permission and bank confirmation explicit, then returned the
        person to their saved Pix. Connecting the account prepares the source;
        each payment still needs its own authorization.
      </p>
      <ol className="showcase-connection-steps">
        <li>
          <strong>Choose the bank</strong>
          <span>Name the source</span>
        </li>
        <li>
          <strong>Review permission</strong>
          <span>Understand the connection</span>
        </li>
        <li>
          <strong>Confirm at the bank</strong>
          <span>Link account and device</span>
        </li>
        <li>
          <strong>Return to the Pix</strong>
          <span>Review this payment</span>
        </li>
      </ol>
      <Button variant="outline" asChild>
        <a
          href="/prototype.html?scenario=first&step=connection"
          target="clara-case-prototype"
        >
          Try first connection <ArrowUpRight size={16} />
        </a>
      </Button>
      <Button variant="link" asChild>
        <a
          href="/prototype.html?scenario=first&step=connection&bank=Example%20Bank%20B"
          target="clara-case-prototype"
        >
          Try bank authorization <ArrowUpRight size={16} />
        </a>
      </Button>
      <p className="story-caption">
        The official JSR 2.2.0 pilot includes PJ and desktop. I would enable
        this route only for verified provider/bank combinations; otherwise, a
        supported bank-authorization handoff would return to the same saved
        payment. Try Bank A for device confirmation or Bank B for bank
        authorization and return. Account-unavailable controls are in the
        scenario explorer.
      </p>
    </div>
  )
}

export function IterationChoices() {
  return (
    <div className="showcase-iteration-choices showcase-panel showcase-panel-soft">
      <p className="eyebrow">ALTERNATIVES THAT SHAPED THE INTERFACE</p>
      <div className="showcase-reasoning-grid">
        <div>
          <span>ENTRY</span>
          <h3>Separate choice modal → anchored popover</h3>
          <p>
            I moved the source choice to New payment to keep it near the
            initiating action.
          </p>
        </div>
        <div>
          <span>MOBILE</span>
          <h3>Compressed table → readable payment rows</h3>
          <p>
            I changed the composition while keeping the same filters, ordering
            and selection rules.
          </p>
        </div>
        <div>
          <span>RECOVERY</span>
          <h3>Abrupt form return → explained correction</h3>
          <p>
            I preserved the request and made the transition back to editing
            intentional.
          </p>
        </div>
      </div>
    </div>
  )
}

const artifacts = [
  {
    category: 'Evidence',
    title: 'The current journey',
    description: 'Observed screens, friction and the starting point.',
    href: '/#/as-is',
  },
  {
    category: 'Reasoning',
    title: 'Needs and hypotheses',
    description: 'The questions behind the proposed experience.',
    href: '/#/discovery',
  },
  {
    category: 'Decisions',
    title: 'Solution and scope',
    description: 'Interface choices, responsibilities and boundaries.',
    href: '/#/approach',
  },
  {
    category: 'Process',
    title: 'Contribution and AI',
    description: 'My decisions, iterations and implementation work.',
    href: '/#/process',
  },
  {
    category: 'Experience',
    title: 'Interactive prototype',
    description: 'Connection, payment, approval and recovery scenarios.',
    href: '/prototype.html',
  },
  {
    category: 'System',
    title: 'The shared design system',
    description: 'Live components, usage examples, code and contracts.',
    href: '/design-system.html',
  },
]

export function ShowcaseArtifacts() {
  return (
    <section id="story-artifacts" tabIndex={-1}>
      <p className="eyebrow">EXPLORE THE WORK</p>
      <div className="showcase-chapter-heading">
        <h2>Take a closer look where it matters to you.</h2>
        <p>
          The story connects my decisions. These artifacts let you inspect the
          evidence, try the experience and look at how it was built.
        </p>
      </div>
      <div className="showcase-artifact-grid">
        {artifacts.map((artifact) => (
          <a
            key={artifact.href}
            href={artifact.href}
            target={
              artifact.href.startsWith('/prototype.html')
                ? 'clara-case-prototype'
                : artifact.href.startsWith('/design-system.html')
                  ? 'clara-case-design-system'
                  : 'clara-case-hub'
            }
          >
            <span className="showcase-artifact-category">
              {artifact.category}
              <ArrowUpRight size={18} aria-hidden="true" />
            </span>
            <h3>{artifact.title}</h3>
            <p>{artifact.description}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
