import { Skeleton } from '../ui/skeleton'
export function ContentSkeleton({
  label = 'Loading content',
  variant = 'document',
}: {
  label?: string
  variant?: 'document' | 'table'
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="content-skeleton"
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="skeleton-title" />
      {variant === 'table' ? (
        Array.from({ length: 4 }, (_, i) => (
          <div className="skeleton-row" key={i}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ))
      ) : (
        <>
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-line skeleton-short" />
          <Skeleton className="skeleton-panel" />
        </>
      )}
    </div>
  )
}
