import { useState } from 'react'
import { Bank, Wallet, ArrowRight, CaretDown } from '@phosphor-icons/react'
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Pressable,
  Stack,
} from '@/design-system'
export function FundingMenu({
  onExternal,
  align = 'end',
  inverse = false,
}: {
  onExternal: () => void
  align?: 'start' | 'end'
  inverse?: boolean
}) {
  const [open, setOpen] = useState(false),
    [existing, setExisting] = useState(false)
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) setExisting(false)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant={inverse ? 'secondary' : 'default'}>
          New payment
          <CaretDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={8}
        collisionPadding={16}
        className="proto-funding-menu"
      >
        <Stack gap={8}>
          <h2 className="type-h3">Pay from</h2>
          <Pressable
            className="proto-funding-option"
            onClick={() => setExisting(true)}
          >
            <Wallet size={16} />
            <span>
              <strong>Clara balance</strong>
              <span className="type-ui">Funds held in Clara</span>
            </span>
            <ArrowRight size={16} />
          </Pressable>
          <Pressable
            className="proto-funding-option proto-funding-external"
            onClick={() => {
              setOpen(false)
              onExternal()
            }}
          >
            <Bank size={16} />
            <span>
              <strong>Business bank account</strong>
              <span className="type-ui">Pix using funds at another bank</span>
            </span>
            <ArrowRight size={16} />
          </Pressable>
          {existing && (
            <p className="type-ui" role="status">
              Clara balance continues the existing payment flow and company
              policy. It is preserved in this proposal; only the new
              external-bank flow is interactive in this case.
            </p>
          )}
        </Stack>
      </PopoverContent>
    </Popover>
  )
}
