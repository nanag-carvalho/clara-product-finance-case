import { useState } from 'react'
import { Check, CaretUpDown } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
export type ComboboxOption = {
  value: string
  label: string
  disabled?: boolean
}
export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select…',
  disabled = false,
}: {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  label: string
  placeholder?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          disabled={disabled}
          className="combobox-trigger"
        >
          {options.find((o) => o.value === value)?.label ?? placeholder}
          <CaretUpDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="combobox-popover">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}`} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  disabled={o.disabled}
                  onSelect={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    size={16}
                    className={value === o.value ? '' : 'invisible'}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
