import { BrandMark } from '@/design-system'
/** Two aligned surfaces describe bank funding and supplier payment; brand sits clear of both. */
export function NewPaymentIllustration() {
  return (
    <div className="proto-new-payment-art" aria-hidden="true">
      <svg viewBox="0 0 88 66" fill="none">
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            x="3"
            y="17"
            width="42"
            height="38"
            rx="8"
            fill="var(--slate-800)"
            strokeOpacity=".65"
          />
          <path d="M11 31 L24 24 L37 31 Z M14 35 V44 M24 35 V44 M34 35 V44 M11 48 H37" />
          <path
            d="M46 24 H52 Q59 24 59 30 M55 27 L59 31 L63 27"
            strokeOpacity=".6"
          />
          <rect
            x="35"
            y="34"
            width="49"
            height="29"
            rx="7"
            fill="var(--slate-900)"
            strokeOpacity=".8"
          />
          <circle cx="46" cy="47" r="5" strokeOpacity=".8" />
          <path d="M43.5 47 L45.3 48.8 L48.5 45.4 M57 45 H75 M57 51 H69" />
        </g>
      </svg>
      <span className="proto-payment-art-brand">
        <BrandMark />
      </span>
    </div>
  )
}
