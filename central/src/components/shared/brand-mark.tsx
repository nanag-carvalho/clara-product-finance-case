/** Official Clara asset; the compact variant exposes only the symbol. */
export function BrandMark({wordmark=false}:{wordmark?:boolean}) {
  return <span className={wordmark?'clara-brand-asset clara-brand-wordmark':'clara-brand-asset'} aria-hidden="true"><img src="/brand/clara-logo.webp" alt="" /></span>
}
