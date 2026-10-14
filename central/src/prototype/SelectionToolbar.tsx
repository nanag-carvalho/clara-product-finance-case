import { DotsThreeVertical } from '@phosphor-icons/react'
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/design-system'
type Props = {
  count: number
  total: string
  canApprove: boolean
  onApprove: () => void
  onReject: () => void
  onExport: () => void
  onClear: () => void
}
/** Keep consequential decisions visible; place secondary mobile actions behind a labeled menu. */
export function SelectionToolbar({
  count,
  total,
  canApprove,
  onApprove,
  onReject,
  onExport,
  onClear,
}: Props) {
  return (
    <div className="proto-bulk-bar" aria-live="polite">
      <div className="proto-selection-summary">
        <strong>{count} selected</strong>
        <span className="type-caption">{total} total</span>
      </div>
      <div className="proto-case-actions">
        {canApprove && (
          <>
            <Button size="sm" onClick={onApprove}>
              Approve selected
            </Button>
            <Button size="sm" variant="outline" onClick={onReject}>
              Reject selected
            </Button>
          </>
        )}
        <div className="proto-desktop-selection-actions">
          <Button size="sm" variant="outline" onClick={onExport}>
            Export selected
          </Button>
          <Button size="sm" variant="ghost" onClick={onClear}>
            Clear selection
          </Button>
        </div>
        <div className="proto-mobile-selection-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More selection actions"
              >
                <DotsThreeVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="proto-mobile-selection-menu"
            >
              <DropdownMenuItem onSelect={onExport}>
                Export selected
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onClear}>
                Clear selection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
