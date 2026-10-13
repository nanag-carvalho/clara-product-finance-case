import { Badge } from '@/components/ui/badge'

export type EvidenceKind = 'Demo' | "Official" | "Reconstruction"
export function EvidenceBadge({ kind }: { kind: EvidenceKind }) {
  const style = kind === 'Demo' ? 'demo' : kind === "Official" ? 'official' : 'reconstruction'
  return <Badge variant="outline" className={`evidence evidence-${style}`}>{kind === "Official" ? "Official source" : kind}</Badge>
}
