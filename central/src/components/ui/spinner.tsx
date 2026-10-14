import type { ComponentProps } from 'react'
import { SpinnerGap } from '@phosphor-icons/react'
export function Spinner({
  className = '',
  ...props
}: ComponentProps<typeof SpinnerGap>) {
  return (
    <SpinnerGap
      {...props}
      data-slot="spinner"
      aria-hidden="true"
      className={`ds-spinner ${className}`}
    />
  )
}
