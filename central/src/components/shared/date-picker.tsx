import { CalendarDots } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { enUS } from 'date-fns/locale'
import { useState } from 'react'
export function DatePicker({
  value,
  onChange,
  label = 'Select date',
  disabled = false,
}: {
  value?: Date
  onChange: (date: Date | undefined) => void
  label?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={disabled} aria-label={label}>
          <CalendarDots size={16} />
          {value ? value.toLocaleDateString('en-US') : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="date-picker-popover">
        <Calendar
          locale={enUS}
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
