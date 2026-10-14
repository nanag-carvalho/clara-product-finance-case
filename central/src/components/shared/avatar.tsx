export function Avatar({
  name,
  initials,
}: {
  name: string
  initials?: string
}) {
  const letters =
    initials ??
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  return (
    <span className="ds-avatar" role="img" aria-label={`${name} profile`}>
      {letters}
    </span>
  )
}
