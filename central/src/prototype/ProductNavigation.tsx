import type { ReactNode, Dispatch, SetStateAction } from 'react'
import {
  Buildings,
  ListChecks,
  Wallet,
  CreditCard,
  ShieldCheck,
  House,
  CaretDown,
  type Icon,
} from '@phosphor-icons/react'
import {
  Button,
  Separator,
  Stack,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/design-system'
export type WorkspaceView = 'overview' | 'payments' | 'accounts'
const navGroups: {
  label: string
  icon: Icon
  items: { label: string; id?: WorkspaceView }[]
}[] = [
  {
    label: 'Account',
    icon: Buildings,
    items: [
      { label: 'Summary' },
      { label: 'Transactions' },
      { label: 'Tasks' },
    ],
  },
  {
    label: 'Management',
    icon: ListChecks,
    items: [
      { label: 'Cards' },
      { label: 'Reimbursements' },
      { label: 'Team' },
      { label: 'Company' },
      { label: 'Activity' },
    ],
  },
  {
    label: 'Digital account',
    icon: Wallet,
    items: [
      { label: 'Dashboard' },
      { label: 'Pix area' },
      { label: 'Settings' },
      { label: 'Connected banks', id: 'accounts' },
    ],
  },
  {
    label: 'Accounts payable',
    icon: CreditCard,
    items: [
      { label: 'Overview', id: 'overview' },
      { label: 'Inbox' },
      { label: 'Payments', id: 'payments' },
    ],
  },
  {
    label: 'Benefits',
    icon: ShieldCheck,
    items: [{ label: 'Partners' }, { label: 'Points' }, { label: 'Referrals' }],
  },
]
type Props = {
  view: WorkspaceView
  collapsed: boolean
  mobile: boolean
  openNavGroup: string
  setOpenNavGroup: Dispatch<SetStateAction<string>>
  setCollapsed: Dispatch<SetStateAction<boolean>>
  navigate: (view: WorkspaceView) => void
  brand: ReactNode
  sidebarPromo: ReactNode
}
/** Preserve the current product's information architecture; enable only implemented destinations. */
export function ProductNavigation({
  view,
  collapsed,
  mobile,
  openNavGroup,
  setOpenNavGroup,
  setCollapsed,
  navigate,
  brand,
  sidebarPromo,
}: Props) {
  return (
    <Stack gap={8}>
      {mobile && brand}
      <Separator />
      <nav aria-label="Product navigation">
        <Stack gap={8}>
          {navGroups.map((group) => (
            <section key={group.label} className="proto-nav-group">
              <Button
                variant="ghost"
                className={`proto-nav-group-heading ${(view === 'accounts' ? group.label === 'Digital account' : group.label === 'Accounts payable') ? 'proto-nav-group-active' : ''}`}
                aria-label={group.label}
                aria-expanded={openNavGroup === group.label}
                onClick={() => {
                  if (collapsed && !mobile) setCollapsed(false)
                  setOpenNavGroup((current) =>
                    current === group.label ? '' : group.label,
                  )
                }}
              >
                <group.icon size={16} />
                <span className={collapsed && !mobile ? 'sr-only' : ''}>
                  {group.label}
                </span>
                {(!collapsed || mobile) && <CaretDown size={14} />}
              </Button>
              {(!collapsed || mobile) && openNavGroup === group.label && (
                <div className="proto-nav-group-items">
                  {group.items.map((item) =>
                    item.id ? (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={
                          (
                            item.id === 'payments'
                              ? view === 'payments'
                              : view === item.id
                          )
                            ? 'proto-nav-selected'
                            : ''
                        }
                        aria-current={
                          (
                            item.id === 'payments'
                              ? view === 'payments'
                              : view === item.id
                          )
                            ? 'page'
                            : undefined
                        }
                        onClick={() => navigate(item.id!)}
                      >
                        {item.label}
                        <span
                          className="proto-nav-available-dot"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {' '}
                          · Available in this prototype
                        </span>
                      </Button>
                    ) : (
                      <span
                        key={item.label}
                        className="proto-nav-static"
                        aria-disabled="true"
                      >
                        {item.label}
                      </span>
                    ),
                  )}
                </div>
              )}
            </section>
          ))}
          {collapsed && !mobile && (
            <>
              {[
                { id: 'overview', label: 'Overview', icon: House },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'accounts', label: 'Connected banks', icon: Wallet },
              ].map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      aria-label={item.label}
                      className={
                        (
                          item.id === 'payments'
                            ? view === 'payments'
                            : view === item.id
                        )
                          ? 'proto-nav-selected'
                          : ''
                      }
                      onClick={() => navigate(item.id as WorkspaceView)}
                    >
                      <item.icon size={16} />
                      <span
                        className="proto-nav-available-dot"
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </>
          )}
        </Stack>
      </nav>
      {mobile && sidebarPromo}
    </Stack>
  )
}
