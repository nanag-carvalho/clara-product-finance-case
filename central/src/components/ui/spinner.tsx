import type { ComponentProps } from 'react'
import { LoaderCircle } from 'lucide-react'
export function Spinner({className='',...props}:ComponentProps<typeof LoaderCircle>) {
  return <LoaderCircle {...props} data-slot="spinner" aria-hidden="true" className={`ds-spinner ${className}`}/>
}
