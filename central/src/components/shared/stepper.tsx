import { Check } from '@phosphor-icons/react'
export function Stepper({
  steps,
  current,
}: {
  steps: string[]
  current: number
}) {
  return (
    <ol className="ds-stepper" aria-label="Flow steps">
      {steps.map((step, index) => (
        <li
          key={step}
          aria-current={index === current ? 'step' : undefined}
          data-complete={index < current}
        >
          <span>{index < current ? <Check size={14} /> : index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}
