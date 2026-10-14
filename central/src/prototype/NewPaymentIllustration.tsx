import { BrandMark } from '@/design-system'
/** Bank funds go to the supplier; Clara is the initiation interface, not a top-up destination. */
export function NewPaymentIllustration() {
  return (
    <div className="proto-new-payment-art" aria-hidden="true">
      <svg viewBox="10 45 175 90" fill="none">
        <circle cx="101" cy="76" r="61" stroke="currentColor" opacity=".12" />
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="18"
            y="49"
            width="77"
            height="64"
            rx="12"
            fill="var(--slate-900)"
          />
          <path d="M35 73 L56 63 L77 73 Z M38 79 V94 M50 79 V94 M62 79 V94 M74 79 V94 M34 99 H78" />
          <rect
            x="119"
            y="77"
            width="65"
            height="54"
            rx="12"
            fill="var(--slate-900)"
          />
          <circle cx="141" cy="98" r="6" />
          <path d="M132 115 C133 105 149 105 150 115 M158 96 H173 M158 105 H169" />
          <path d="M95 72 H108 Q119 72 119 83 M114 78 L119 83 L124 78" />
          <path d="M48 130 H81" opacity=".25" />
        </g>
      </svg>
      <span className="proto-payment-art-brand">
        <BrandMark />
      </span>
    </div>
  )
}
