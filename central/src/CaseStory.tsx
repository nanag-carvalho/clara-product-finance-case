import {
  ArrowRight,
  ArrowUpRight,
  Bank,
  Storefront,
} from '@phosphor-icons/react'
import { Button } from '@/design-system'
import ResearchMarkdown from './ResearchMarkdown'
import { caseImageDimensions } from './data/case-images'
import './case-story.css'
import {
  BusinessRationale,
  ProcessRationale,
  AestheticRationale,
  SharedSystemProof,
  EvaluationGuide,
  JourneyEntry,
  ShowcaseArtifacts,
} from './ShowcaseRationale'

const decisions = [
  {
    image: 'overview',
    title: 'Make the next action visible.',
    text: 'I grouped the overview around what needs attention because a finance team has to find the next task across several requests. Company review, authorization and uncertain results each point to a different action.',
  },
  {
    image: 'payments',
    title: 'Support the work around the payment.',
    text: 'When I looked at the queue on mobile, compressing the table made the information harder to read. I changed it into payment rows while keeping the same filters and selection rules, so the composition adapts without changing how the work behaves.',
  },
  {
    image: 'request',
    title: 'Separate approval from moving money.',
    text: 'An approved request still needs authorization before money moves. I made that distinction visible in the progress and history, so someone returning to the request can understand what happened and who needs to act next.',
  },
  {
    image: 'recovery',
    title: 'A correction should not erase the work.',
    text: 'I treated rejection and an unknown result differently because they ask for different decisions. A rejected request returns to editing with its details preserved; an uncertain payment stays available for a status check before another attempt.',
  },
]

/** Contextual authorship notes stay beside the story, not in its reading flow. */
function AIProcessNote({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className="showcase-evaluator-guide"
      aria-label="My use of AI in this chapter"
    >
      <strong>My use of AI</strong>
      <p>{children}</p>
      <a href="/#/process" target="clara-case-hub">
        Read this process in the hub <ArrowUpRight size={14} />
      </a>
    </aside>
  )
}

/** Standalone editorial narrative, linked to the research hub for evidence. */
export default function CaseStory({
  onImage,
}: {
  onImage: (file: string, alt: string) => void
}) {
  const jumpTo = (id: string) => {
    const section = document.getElementById(`story-${id}`)
    section?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    })
    section?.focus({ preventScroll: true })
  }
  return (
    <article className="case-story">
      <header className="story-hero">
        <div className="showcase-hero-copy">
          <p className="eyebrow">NÁGELA CARVALHO · DESIGN ENGINEER</p>
          <h1>
            Pay suppliers in Clara.
            <br />
            <em>Use funds from your bank.</em>
          </h1>
          <p className="story-intro">
            The brief asked for a supplier Pix using funds at another bank. I
            explored how to bring that payment into Clara while keeping the
            source, company decisions and next steps clear throughout the
            journey.
          </p>
          <div className="story-actions">
            <Button asChild>
              <a href="/prototype.html" target="clara-case-prototype">
                Explore the prototype <ArrowUpRight size={16} />
              </a>
            </Button>
            <Button variant="outline" onClick={() => jumpTo('context')}>
              Read the case <ArrowRight size={16} />
            </Button>
          </div>
        </div>
        <div className="showcase-hero-visual">
          <div className="showcase-preview-label">
            <span /> THE PROPOSED WORKSPACE
          </div>
          <button
            className="showcase-preview"
            onClick={() =>
              onImage(
                '/proposal/overview.png',
                'Proposed accounts payable workspace',
              )
            }
            aria-label="Enlarge the proposed workspace"
          >
            <img
              src="/proposal/overview.png"
              {...caseImageDimensions['/proposal/overview.png']}
              alt="Clara accounts payable overview with actionable payment queues"
            />
          </button>
          <div
            className="showcase-money-path"
            aria-label="Payment path: your bank, initiated in Clara, to your supplier"
          >
            <span>
              <Bank size={18} aria-hidden="true" />
              Your bank
            </span>
            <i aria-hidden="true" />
            <span>Via Clara</span>
            <i aria-hidden="true" />
            <span>
              <Storefront size={18} aria-hidden="true" />
              Supplier
            </span>
          </div>
        </div>
        <dl className="story-facts">
          <div>
            <dt>My role</dt>
            <dd>Product reasoning, UX/UI and implementation</dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>Supplier Pix · Brazilian business accounts</dd>
          </div>
          <div>
            <dt>Deliverables</dt>
            <dd>Responsive prototype, shared DS and automated checks</dd>
          </div>
        </dl>
      </header>
      <div className="story-layout">
        <div className="story-chapters">
          <div className="showcase-act">
            <div className="showcase-act-label">
              <span>01 / THE OPPORTUNITY</span>
              <p>From the existing operation to the funding decision</p>
              <AIProcessNote>
                AI organized the brief and references. I corrected the framing
                when it drifted beyond the assigned external-payment
                opportunity.
              </AIProcessNote>
            </div>
            <div className="showcase-act-content">
              <section id="story-context" tabIndex={-1}>
                <p className="eyebrow">01 · PROBLEM AND EVIDENCE</p>
                <div className="showcase-chapter-heading">
                  <h2>
                    The payment started with another task: funding the account.
                  </h2>
                  <p>
                    What caught my attention in the brief was the work before
                    the payment. The finance manager had to open the bank, fund
                    Clara and return before paying a supplier. With dozens of
                    payments each week, that preparation became my starting
                    point.
                  </p>
                </div>
                <p>
                  Before changing the flow, I reviewed the demo and official
                  references to understand how payments, approvals and tracking
                  already worked. I wanted the proposal to fit that operation,
                  so I kept the existing controls visible as I explored the new
                  source.
                </p>
                <ResearchMarkdown
                  body="![Payments in the observed Clara demo](assets/06-pagamentos.png)"
                  onImage={onImage}
                />
                <p className="story-caption">
                  Starting point · captured demo interface. The top-up
                  requirement comes from the brief. I used public Radix
                  primitives and a case-specific DS, with fictional data;
                  Clara’s internal data and library were not available.
                </p>
                <Button variant="link" asChild>
                  <a href="/#/as-is" target="clara-case-hub">
                    Inspect the current journey <ArrowRight size={16} />
                  </a>
                </Button>
              </section>
              <BusinessRationale />
              <section id="story-direction" tabIndex={-1}>
                <p className="eyebrow">03 · THE DESIGN DECISION</p>
                <div className="showcase-chapter-heading">
                  <h2>
                    Bring the source into the payment, and keep the controls
                    around it.
                  </h2>
                  <p>
                    I placed source choice next to New payment so it stays close
                    to the task. I kept Clara balance because prefunding may
                    already fit the team’s routine, and connected an external
                    account only when needed. That setup adds effort on first
                    use; its value depends on whether the team chooses the route
                    again.
                  </p>
                </div>
                <div className="story-comparison">
                  <div>
                    <h3>Starting point</h3>
                    <ol className="showcase-flow">
                      <li>Bank</li>
                      <li className="flow-friction">Top up Clara</li>
                      <li>Prepare</li>
                      <li>Approve</li>
                      <li>Pay</li>
                    </ol>
                  </div>
                  <div>
                    <h3>Proposed journey</h3>
                    <ol className="showcase-flow">
                      <li className="flow-focus">Pix + source</li>
                      <li>Approve</li>
                      <li>Authorize</li>
                      <li>Confirm</li>
                    </ol>
                  </div>
                </div>
                <aside
                  className="showcase-effort-example"
                  aria-labelledby="effort-example-title"
                >
                  <p className="eyebrow">
                    ESTIMATING THE DECISION · REPEAT USE
                  </p>
                  <h3 id="effort-example-title">
                    One less transfer before the supplier gets paid.
                  </h3>
                  <div className="showcase-effort-comparison">
                    <div className="showcase-panel showcase-panel-dark">
                      <span>Money movements</span>
                      <strong>2 Pix → 1 Pix</strong>
                      <p>
                        One fresh top-up, then one supplier payment → pay the
                        supplier directly.
                      </p>
                    </div>
                    <div className="showcase-panel showcase-panel-dark">
                      <span>Illustrative funding effort</span>
                      <strong>2m → 15s</strong>
                      <p>
                        About 1m 45s less active work when a separate top-up is
                        needed for each payment.
                      </p>
                    </div>
                  </div>
                  <p className="story-caption">
                    Assumed task budget, not observed timings: 45s to access the
                    bank + 45s to prepare and confirm the top-up + 30s to return
                    and check Clara, versus 15s to choose a connected account.
                    Payment preparation, approval and authorization remain; bank
                    redirection may still be required.
                  </p>
                  <a
                    href="/#/approach?section=solution-value"
                    target="clara-case-hub"
                  >
                    Read the assumptions and limits <ArrowRight size={16} />
                  </a>
                </aside>
                <p>
                  This makes the opportunity concrete: remove the extra funding
                  task when it gets in the way. First connection adds work, and
                  prefunded or shared top-ups change the comparison. That is why
                  I kept Clara balance and would evaluate correct completion and
                  voluntary reuse, with time as supporting evidence.
                </p>
              </section>
            </div>
          </div>
          <div className="showcase-act">
            <div className="showcase-act-label">
              <span>02 / MY DESIGN REASONING</span>
              <p>How the decisions shaped the experience</p>
              <AIProcessNote>
                I directed hierarchy, progressive disclosure and brand feedback.
                AI implemented the iterations; I shaped how the interface guides
                attention and communicates care.
              </AIProcessNote>
            </div>
            <div className="showcase-act-content">
              <ProcessRationale />

              <section id="story-hypotheses" tabIndex={-1}>
                <p className="eyebrow">05 · FROM OPPORTUNITY TO HYPOTHESIS</p>
                <div className="showcase-chapter-heading">
                  <h2>Four questions kept the decisions connected.</h2>
                  <p>
                    To give those iterations a consistent reference, I framed
                    four questions about the user’s task. Each became a
                    hypothesis linked to situations in the prototype and an
                    observation for a future evaluation.
                  </p>
                </div>
                <p className="showcase-editorial-note">
                  Can someone choose the source in context, recognize who acts
                  next, resume without a duplicate and review the right details
                  together? These became H1–H4 in the prototype scenarios.
                </p>
                <Button variant="link" asChild>
                  <a href="/#/discovery" target="clara-case-hub">
                    Read the needs and supporting reasoning{' '}
                    <ArrowRight size={16} />
                  </a>
                </Button>
              </section>
              <AestheticRationale onImage={onImage} />
            </div>
          </div>
          <div className="showcase-act">
            <div className="showcase-act-label">
              <span>03 / THE EXPERIENCE</span>
              <p>Follow one payment through its decisions</p>
              <AIProcessNote>
                I replaced the separate choice modal with a popover and
                challenged the mobile table. AI helped implement and refine
                those changes.
              </AIProcessNote>
            </div>
            <div className="showcase-act-content">
              <section id="story-experience" tabIndex={-1}>
                <p className="eyebrow">07 · THE PROPOSED EXPERIENCE</p>
                <div className="showcase-chapter-heading">
                  <h2>One payment, from preparation to a known outcome.</h2>
                  <p>
                    With that visual language in place, I worked through the
                    payment itself. A unified Pix field accepts the recipient
                    information without asking the person to classify it first;
                    lookup then brings the recipient into a review alongside the
                    amount and funding source.
                  </p>
                </div>
                <JourneyEntry />
                <div className="showcase-experience-scenes">
                  {decisions.map((decision, index) => (
                    <div className="story-decision" key={decision.image}>
                      <div className="story-decision-copy">
                        <span className="eyebrow">
                          0{index + 1} / THE DECISION
                        </span>
                        <h3>{decision.title}</h3>
                        <p>{decision.text}</p>
                      </div>
                      <figure className="story-decision-visual">
                        <div
                          className="showcase-screen-scroll"
                          tabIndex={0}
                          role="region"
                          aria-label={`${decision.title} — scroll to inspect the screen`}
                        >
                          <img
                            src={`/proposal/${decision.image}.png`}
                            {...caseImageDimensions[
                              `/proposal/${decision.image}.png`
                            ]}
                            alt={decision.title}
                            loading="lazy"
                          />
                        </div>
                        <figcaption>
                          <button
                            type="button"
                            aria-label="Enlarge screen"
                            className="showcase-image-caption"
                            onClick={() =>
                              onImage(
                                `/proposal/${decision.image}.png`,
                                decision.title,
                              )
                            }
                          >
                            <span>{decision.title}</span>
                            <ArrowUpRight size={14} aria-hidden="true" />
                          </button>
                        </figcaption>
                      </figure>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div className="showcase-act">
            <div className="showcase-act-label">
              <span>04 / MAKING IT WORK</span>
              <p>Shared patterns, implementation and evaluation</p>
              <AIProcessNote>
                Codex helped implement my direction; the DS contract and
                regression checks made parts of it repeatable. I caught visual
                and mobile problems after tests passed. The hub records the
                prompts, review and estimated effort allocation.
              </AIProcessNote>
            </div>
            <div className="showcase-act-content">
              <section id="story-foundation" tabIndex={-1}>
                <p className="eyebrow">08 · DESIGN INTO CODE</p>
                <div className="showcase-chapter-heading">
                  <h2>Carry the decisions into shared components.</h2>
                  <p>
                    The same interaction choices appeared across several
                    screens, so I moved them into shared tokens and component
                    patterns. The hub, prototype and this showcase consume the
                    same DS; its public API also gives AI-assisted
                    implementation an explicit contract to follow.
                  </p>
                </div>

                <SharedSystemProof />
              </section>
              <section id="story-validation" tabIndex={-1}>
                <p className="eyebrow">09 · VALIDATION AND NEXT STEPS</p>
                <div className="showcase-chapter-heading">
                  <h2>I followed the payment beyond the happy path.</h2>
                  <p>
                    Once the main journey worked, I explored the moments that
                    could leave the finance team unsure: a rejection, an
                    interrupted confirmation or an unknown result. The same job
                    still matters—pay the supplier, preserve the work and know
                    what happened.
                  </p>
                </div>
                <EvaluationGuide />
                <details className="story-boundaries">
                  <summary>Scope and production dependencies</summary>
                  <p>
                    This prototype uses fictional data and simulated bank,
                    device and payment responses. It illustrates one manual
                    approval layer. Automatic approval, dynamic QR resolution
                    and real financial integration require further work.
                    In-Clara authorization depends on provider support, business
                    eligibility and signatory permissions.
                  </p>
                </details>
                <div className="story-actions">
                  <Button asChild>
                    <a href="/prototype.html" target="clara-case-prototype">
                      Try the payment journey <ArrowUpRight size={16} />
                    </a>
                  </Button>
                  <Button variant="link" asChild>
                    <a href="/#/sources" target="clara-case-hub">
                      Sources and remaining gaps <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
              </section>
            </div>
          </div>
          <ShowcaseArtifacts />
        </div>
      </div>
    </article>
  )
}
