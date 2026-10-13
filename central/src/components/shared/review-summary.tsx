import type {ReactNode} from 'react'
export type ReviewField={label:string;value:ReactNode}
export function ReviewSummary({fields,title="Review payment",actions}:{fields:ReviewField[];title?:string;actions?:ReactNode}){return <section className="ds-review"><h3 className="type-h3">{title}</h3><dl>{fields.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl>{actions&&<div className="ds-inline" style={{gap:'var(--space-8)'}}>{actions}</div>}</section>}
