import type { ReactNode } from 'react'
export type FlowStateKind =
  | 'setup'
  | 'security'
  | 'waiting'
  | 'ready'
  | 'processing'
  | 'unknown'
  | 'paid'
  | 'failed'
/** Service feedback: illustration supports the title; owner and next action carry meaning. */
export function FlowState({
  kind,
  title,
  description,
  owner,
  next,
  action,
  footer,
  compact = false,
}: {
  kind: FlowStateKind
  title: string
  description: string
  owner?: string
  next?: string
  action?: ReactNode
  footer?: ReactNode
  compact?: boolean
}) {
  return (
    <section
      className={`ds-flow-state ${compact ? 'compact' : ''}`}
      data-state={kind}
      aria-label={title}
    >
      <FlowIllustration kind={kind} />
      <div className="ds-flow-state-copy">
        {owner && <p className="type-caption flow-owner">{owner}</p>}
        <h3 className="type-h3">{title}</h3>
        <p className="type-ui">{description}</p>
        {next && <p className="type-caption flow-next">Next · {next}</p>}
        {action && <div className="flow-state-actions">{action}</div>}
      </div>
      {footer && <div className="flow-state-footer">{footer}</div>}
    </section>
  )
}

export function FlowIllustration({ kind }: { kind: FlowStateKind }) {
  return (
    <svg
      viewBox="0 0 160 112"
      className="ds-flow-illustration"
      aria-hidden="true"
      fill="none"
    >
      <ellipse className="flow-ground" cx="80" cy="98" rx="55" ry="6" />
      <g
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 25 Q40 20 46 20 L107 22 Q112 22 112 28 L110 83 Q110 89 104 89 L45 87 Q39 87 39 81 Z" />
        <path d="M54 39 L94 40 M54 50 L87 51 M54 61 L78 62" opacity=".45" />
        {kind === 'security' ? (
          <>
            <rect
              x="87"
              y="59"
              width="47"
              height="33"
              rx="6"
              className="flow-paper"
            />
            <path
              className="flow-security-lock"
              d="M99 59 V49 Q99 38 111 38 Q123 38 123 49 V59"
            />
            <circle cx="111" cy="74" r="3" />
            <path d="M111 77 V82" />
            <path d="M25 29 L19 25 M137 29 L143 25" opacity=".4" />
          </>
        ) : kind === 'waiting' || kind === 'unknown' ? (
          <>
            <circle cx="113" cy="77" r="21" className="flow-paper" />
            <path d="M113 65 V78 L122 83" />
            <path
              d="M27 43 Q18 51 23 60 M132 32 Q145 38 140 49"
              opacity=".45"
            />
          </>
        ) : kind === 'ready' || kind === 'paid' ? (
          <>
            <circle cx="113" cy="77" r="21" className="flow-paper" />
            <path d="M102 77 L110 85 L125 69" />
            <path
              d="M27 32 L22 27 M127 21 L132 16 M136 43 L144 41"
              opacity=".45"
            />
          </>
        ) : kind === 'failed' ? (
          <>
            <circle cx="113" cy="77" r="21" className="flow-paper" />
            <path d="M113 66 V79 M113 87 h.1" />
          </>
        ) : kind === 'processing' ? (
          <>
            <circle cx="113" cy="77" r="21" className="flow-paper" />
            <circle
              className="flow-transfer-dot"
              cx="68"
              cy="72"
              r="2.5"
              fill="currentColor"
              stroke="none"
            />
            <g className="flow-processing-mark">
              <path d="M113 64 A13 13 0 1 1 100 77" />
              <path d="M96 81 L100 77 L104 81" />
            </g>
          </>
        ) : (
          <>
            <rect
              x="88"
              y="62"
              width="47"
              height="30"
              rx="6"
              className="flow-paper"
            />
            <path d="M89 73 H134 M99 84 H108 M54 71 H68" />
          </>
        )}
      </g>
    </svg>
  )
}
