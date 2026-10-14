import { BrandMark } from './brand-mark'
export function BrandLoading({ label }: { label: string }) {
  return (
    <div
      className="ds-brand-loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="ds-brand-composition" aria-hidden="true">
        <div className="ds-brand-wash" />
        <div className="ds-brand-floating">
          <BrandMark />
        </div>
      </div>
      <p className="type-ui">{label}</p>
    </div>
  )
}
