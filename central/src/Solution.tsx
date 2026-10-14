import ResearchMarkdown from './ResearchMarkdown'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Badge, Button, Stack } from '@/design-system'

const screens = [
  {
    id: 'solution-overview',
    image: 'overview',
    scenario: 'approval',
    title: 'See what needs attention',
    hypothesis: 'H2 · Responsibility',
    description:
      'I kept three actionable queues in the overview so the next actor can find company review, authorization or an uncertain result without opening every request.',
    alt: 'Accounts payable overview with three actionable queues and recently updated payments',
  },
  {
    id: 'solution-volume',
    image: 'payments',
    scenario: 'ready',
    title: 'Work with a payment queue',
    hypothesis: 'H4 · Review clarity',
    description:
      'I kept source and status in each row, with contextual filters and bulk review for repeated work. On mobile, the same records become readable lists.',
    alt: 'Payments table with source bank, updated date, status, selection and filtering',
  },
  {
    id: 'solution-tracking',
    image: 'request',
    scenario: 'approval',
    title: 'Keep the request understandable',
    hypothesis: 'H2 · Responsibility',
    description:
      'I separated company approval from payment completion and kept progress beside request details. On mobile, history expands inside the same scroll.',
    alt: 'Saved payment request with details and a fixed progress and history column',
  },
  {
    id: 'solution-recovery',
    image: 'recovery',
    scenario: 'rejected',
    title: 'Correct without starting over',
    hypothesis: 'H3 · Recovery',
    description:
      'I placed the reason beside the saved request and preserved its details during correction. A changed request returns to review rather than reusing an outdated approval.',
    alt: 'Rejected request showing its reason, retained details, history and Correct request action',
  },
]
export default function Solution({
  onImage,
}: {
  onImage: (file: string, alt: string) => void
}) {
  return (
    <Stack gap={24}>
      <section id="solution-entry" className="solution-screen">
        <h2 className="type-h2">
          Bring the source into the existing payment task
        </h2>
        <p className="type-ui">
          New payment offers Clara balance alongside the proposed business-bank
          account. I kept this choice in an anchored popover: a separate modal
          gave a short decision too much weight. The Clara-balance route remains
          visible as existing product context; this case implements the
          external-bank journey.
        </p>
        <h3 className="type-h3">
          Recognize the input, then review the recipient
        </h3>
        <p className="type-ui">
          The Pix field recognizes supported key formats and static Copia e
          Cola. Paste is an explicit action; QR scanning is a camera simulation.
          Recipient lookup uses fictional data. The person still checks
          recipient identity, amount and source before submitting the request.
        </p>
      </section>
      <section id="solution-connection" className="solution-screen">
        <h2 className="type-h2">Connect once; authorize each payment</h2>
        <p className="type-ui">
          First use introduces account selection, permission, bank confirmation
          and device setup before returning to the saved payment. A prepared
          eligible account can be reused. Connection does not authorize future
          payments: company approval and payment-specific confirmation remain
          separate decisions.
        </p>
        <Button variant="link" asChild>
          <a
            href="/prototype.html?scenario=first&step=connection"
            target="_blank"
            rel="noreferrer"
          >
            Inspect first connection <ArrowUpRight size={16} />
          </a>
        </Button>
      </section>
      {screens.map((screen) => (
        <section key={screen.id} id={screen.id} className="solution-screen">
          <div className="solution-screen-heading">
            <h2 className="type-h2">{screen.title}</h2>
            <Badge variant="outline" asChild>
              <a
                href={`/prototype.html?scenario=${screen.scenario}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Explore ${screen.hypothesis} in the prototype`}
              >
                {screen.hypothesis}
              </a>
            </Badge>
          </div>
          <p className="type-ui">{screen.description}</p>
          <ResearchMarkdown
            body={`![${screen.alt}](/proposal/${screen.image}.png)`}
            onImage={onImage}
          />
        </section>
      ))}
      <details className="solution-boundaries">
        <summary>Scope and feasibility</summary>
        <Stack gap={16} className="solution-boundaries-content">
          <p className="type-ui">
            The prototype illustrates one manual approval layer. Automatic
            rules, dynamic QR resolution and production integration remain
            outside the simulation. Authorization in Clara depends on provider
            support, PJ eligibility, signatory permissions and device binding.
          </p>
          <Button variant="link" asChild>
            <a
              href="/api/PAYMENT_WIZARD_CONTRACT.md"
              target="_blank"
              rel="noreferrer"
            >
              Read the service contract
              <ArrowUpRight size={16} />
            </a>
          </Button>
        </Stack>
      </details>
    </Stack>
  )
}
