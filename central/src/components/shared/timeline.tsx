export type TimelineEvent = {
  id: string
  title: string
  actor: string
  date: string
  dateTime: string
  description?: string
}
export function Timeline({
  events,
  label = 'Audit history',
}: {
  events: TimelineEvent[]
  label?: string
}) {
  return (
    <ol className="ds-timeline" aria-label={label}>
      {events.map((e) => (
        <li key={e.id}>
          <span className="timeline-dot" />
          <div>
            <h3 className="type-ui">{e.title}</h3>
            <p className="type-caption">
              {e.actor} · <time dateTime={e.dateTime}>{e.date}</time>
            </p>
            {e.description && <p className="type-ui">{e.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
