import { Clock3, LoaderCircle, Check, CircleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type PaymentState = "Pending approval" | "Processing" | "Paid" | "Failed"
const states = {
  "Pending approval": { className: 'status-pending', icon: Clock3 },
  Processing: { className: 'status-processing', icon: LoaderCircle },
  Paid: { className: 'status-success', icon: Check },
  Failed: { className: 'status-error', icon: CircleAlert },
}
export function PaymentStatus({ state }: { state: PaymentState }) {
  const { className, icon: Icon } = states[state]
  return <Badge variant="outline" className={`payment-status ${className}`}><Icon size={13}/>{state}</Badge>
}
