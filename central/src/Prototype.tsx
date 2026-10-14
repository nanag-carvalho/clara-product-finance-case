import {
  WorkspaceViews,
  type PaymentQueueScope,
} from './prototype/WorkspaceViews'
import { getPaymentReviewFields } from './prototype/payment-review'
import { PaymentActions } from './prototype/PaymentActions'
import { useDeferredTask } from './prototype/useDeferredTask'
import { useCompactViewport } from './prototype/useCompactViewport'
import { PaymentFilters } from './prototype/PaymentFilters'
import { PaymentTable } from './prototype/PaymentTable'
import { PaymentOutcome } from './prototype/PaymentOutcome'
import { SourceAccountStep } from './prototype/SourceAccountStep'
import { getPaymentTaskPresentation } from './prototype/payment-task-presentation'
import { PaymentDetailsStep } from './prototype/PaymentDetailsStep'
import { SelectionToolbar } from './prototype/SelectionToolbar'
import {
  ProductNavigation,
  type WorkspaceView,
} from './prototype/ProductNavigation'
import {
  selectPaymentQueue,
  selectPageIds,
  displayDate,
  type PaymentSort,
} from './prototype/payment-queue'
import { ScenarioExplorer } from './prototype/ScenarioExplorer'
import { BankConnectionWizard } from './prototype/BankConnectionWizard'
import { PaymentReview } from './prototype/PaymentFeedback'
import {
  paymentStatusLabels as status,
  scenarioOptions,
} from './prototype/scenarios'
import { NewPaymentIllustration } from './prototype/NewPaymentIllustration'
import { FundingMenu } from './prototype/FundingMenu'
import { demoPixCode } from './prototype/pix-input'
import { PixQrInput } from './prototype/PixQrInput'
import { useEffect, useReducer, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clock,
  Info,
  Bank,
  ListChecks,
  Gear,
  List,
  SidebarSimple,
  Sidebar,
} from '@phosphor-icons/react'
import {
  Toaster,
  toast,
  Dialog,
  DialogContent,
  DialogTitle,
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  BrandMark,
  Button,
  Wizard,
  Checkbox,
  Label,
  PageHeader,
  ScrollArea,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Spinner,
  Stack,
  Timeline,
  TooltipProvider,
  Banner,
  Avatar,
  BrandLoading,
  Textarea,
} from '@/design-system'
import {
  amountCents,
  money,
  type Action,
  type Outcome,
} from './prototype/flow-model'
import {
  initialWorkspace,
  workspaceReducer,
  type WorkspaceAction,
  type Scenario,
} from './prototype/workspace'
import './prototype.css'
export default function Prototype({
  embedded = false,
}: {
  embedded?: boolean
}) {
  const compact = useCompactViewport()
  const [state, dispatch] = useReducer(workspaceReducer, undefined, () =>
    initialWorkspace(
      `DEMO-${crypto.randomUUID().slice(0, 8)}`,
      new Date().toISOString(),
    ),
  )
  const [view, setView] = useState<WorkspaceView>('payments')
  const [controls, setControls] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [scenario, setScenario] = useState<Outcome>('success')
  const statusTask = useDeferredTask()
  const checking = statusTask.label !== null
  const [query, setQuery] = useState('')
  const [flowOpen, setFlowOpen] = useState(false)
  const [editNotice, setEditNotice] = useState('')
  const [qrOpen, setQrOpen] = useState(false)
  const [reviewAsApprover, setReviewAsApprover] = useState(false)

  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null)
  const [setupError, setSetupError] = useState('')
  const [failureCause, setFailureCause] = useState<
    'balance' | 'limit' | 'unavailable'
  >('balance')
  const [connectionResult, setConnectionResult] = useState('confirmed')
  const [openNavGroup, setOpenNavGroup] = useState('Accounts payable')
  useEffect(
    () =>
      setOpenNavGroup(
        view === 'accounts' ? 'Digital account' : 'Accounts payable',
      ),
    [view],
  )
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('clara-sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem('clara-sidebar-collapsed', String(collapsed))
    } catch {}
  }, [collapsed])
  const [deviceLink, setDeviceLink] = useState(false)
  const [setup, setSetup] = useState<
    'list' | 'choose' | 'permission' | 'bank' | 'device' | 'done'
  >('list')
  const [setupBank, setSetupBank] = useState('Example Bank A')
  const [paymentFilter, setPaymentFilter] = useState<PaymentQueueScope>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bulkDecision, setBulkDecision] = useState<'approve' | 'reject' | null>(
    null,
  )
  const [bulkReason, setBulkReason] = useState('')
  const [bulkError, setBulkError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<PaymentSort>('newest')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [tablePage, setTablePage] = useState(0)
  useEffect(() => {
    setTablePage(0)
    setSelectedIds([])
  }, [
    query,
    paymentFilter,
    sourceFilter,
    statusFilter,
    periodFilter,
    view,
    sortOrder,
    dateFrom,
    dateTo,
  ])
  const [rejectionOpen, setRejectionOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectionError, setRejectionError] = useState('')
  const transitionTask = useDeferredTask()
  const transition = transitionTask.label
  const promoStarting = transition === 'starting'
  const rejectionField = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (rejectionError || rejectionOpen) rejectionField.current?.focus()
  }, [rejectionError, rejectionOpen])
  const heading = useRef<HTMLDivElement>(null)
  const send = (action: WorkspaceAction) =>
    dispatch({ ...action, at: new Date().toISOString() })
  useEffect(() => {
    const processing = [...state.payments, state].filter(
      (p) => p.stage === 'processing',
    )
    const timers = processing.map((p) =>
      setTimeout(
        () =>
          dispatch({
            type: 'RESULT',
            attempt: p.attempt,
            outcome: scenario,
            reason: failureCause,
            value: p.intent,
            at: new Date().toISOString(),
          }),
        1000,
      ),
    )
    return () => timers.forEach(clearTimeout)
  }, [
    state.stage,
    state.intent,
    state.attempt,
    state.payments,
    scenario,
    failureCause,
  ])
  useEffect(() => {
    heading.current?.focus()
  }, [view])
  const advance = (action: Action, label: string, after?: () => void) => {
    transitionTask.run(
      label,
      () => {
        send(action)
        after?.()
      },
      label === 'lookup' ? 550 : label === 'editing' ? 280 : 800,
    )
  }
  const receiveConnection = () => {
    if (transition) return
    transitionTask.run(
      'connection',
      () => {
        if (connectionResult === 'refused') {
          send({ type: 'CANCEL_CONNECTION', value: 'refused' })
          setDeviceLink(false)
        } else setDeviceLink(true)
      },
      900,
    )
  }
  const advanceSetup = () => {
    if (transition) return
    if (setup === 'done') {
      setSetup('list')
      return
    }
    if (setup === 'choose') {
      setSetupError('')
      setSetup('permission')
      return
    }
    if (setup === 'permission') {
      setSetupError('')
      setSetup('bank')
      return
    }
    transitionTask.run(
      setup === 'bank' ? 'connection' : 'device',
      () => {
        if (setup === 'bank') {
          if (connectionResult === 'refused') {
            setSetupError(
              'Your bank did not confirm the connection. Try again or choose another bank.',
            )
            setSetup('permission')
          } else {
            setSetupError('')
            setSetup('device')
          }
        } else {
          send({ type: 'REGISTER_ACCOUNT', bank: setupBank })
          setSetup('done')
        }
      },
      setup === 'device' ? 800 : 900,
    )
  }
  const editPayment = (source = false) => {
    setEditNotice(
      source
        ? 'Change the funding account. Recipient and amount are saved.'
        : state.stage === 'rejected'
          ? 'Correct this request: ' + state.rejectionReason
          : 'Edit the saved recipient or amount, then review the request again.',
    )
    advance({ type: 'EDIT', ...(source ? { value: 'source' } : {}) }, 'editing')
  }
  const check = () => {
    const intent = state.intent
    statusTask.run(
      'checking',
      () => {
        dispatch({
          type: 'CHECK',
          outcome: scenario,
          reason: failureCause,
          at: new Date().toISOString(),
          value: intent,
        })
      },
      800,
    )
  }
  const loadData = (value: 'empty' | 'populated') => {
    setReviewAsApprover(false)
    setSelectedIds([])
    transitionTask.cancel()
    statusTask.cancel()
    send({ type: 'LOAD_DATA', value })
    setFlowOpen(false)
    setSetup('list')
    setSourceFilter('all')
    setStatusFilter('all')
    setPeriodFilter('all')
    setSortOrder('newest')
    setQuery('')
    setPaymentFilter('all')
    setView('payments')
  }
  const launchScenario = (option: (typeof scenarioOptions)[number]) => {
    setQrOpen(false)
    setEditNotice('')
    setSelectedIds([])
    transitionTask.cancel()
    statusTask.cancel()
    setDeviceLink(false)
    setSetup('list')
    setSetupError('')
    setRejectionOpen(false)
    setRejectionReason('')
    setRejectionError('')
    setQuery('')
    setSourceFilter('all')
    setStatusFilter('all')
    setPeriodFilter('all')
    setPaymentFilter('all')
    setTablePage(0)
    setScenario('success')
    setFailureCause('balance')
    setConnectionResult('confirmed')
    setActiveScenario(option.id)
    send({ type: 'LOAD_SCENARIO', value: option.id })
    setControls(false)
    setReviewAsApprover(option.id === 'approval')
    setPaymentFilter(option.id === 'approval' ? 'approval' : 'all')
    setView('payments')
    setFlowOpen(true)
  }
  useEffect(() => {
    const scenarioId = new URLSearchParams(window.location.search).get(
      'scenario',
    )
    const option = scenarioOptions.find((item) => item.id === scenarioId)
    if (option) {
      launchScenario(option)
      // Connection deep links prepare the same fictional draft through normal rules.
      if (
        option.id === 'first' &&
        new URLSearchParams(window.location.search).get('step') === 'connection'
      ) {
        send({ type: 'LOOKUP' })
        send({ type: 'REVIEW' })
      }
    } else if (
      new URLSearchParams(window.location.search).get('explore') === 'scenarios'
    ) {
      setControls(true)
    }
  }, [])
  const payFrom = (bank: string) => {
    setView('payments')
    setPaymentFilter('all')
    setFlowOpen(true)
    send({
      type: 'NEW_PAYMENT',
      intent: `DEMO-${crypto.randomUUID().slice(0, 8)}`,
      bank,
    })
  }
  const beginExternal = () => {
    setReviewAsApprover(false)
    setQrOpen(false)
    setEditNotice('')
    setPaymentFilter('all')
    setView('payments')
    setFlowOpen(true)
    send({
      type: 'NEW_PAYMENT',
      intent: `DEMO-${crypto.randomUUID().slice(0, 8)}`,
    })
  }
  const openPayment = (intent: string, asApprover = false) => {
    send({ type: 'OPEN_PAYMENT', intent })
    setReviewAsApprover(asApprover)
    setView('payments')
    setFlowOpen(true)
    setRejectionOpen(false)
    setRejectionReason('')
    setRejectionError('')
  }
  const navigate = (id: WorkspaceView) => {
    setQuery('')
    setSourceFilter('all')
    setStatusFilter('all')
    setPeriodFilter('all')
    setTablePage(0)
    setView(id)
    setMobile(false)
  }
  const allPayments = [
    ...state.payments,
    ...(state.stage === 'idle' ? [] : [state]),
  ]
  const filteredPayments = allPayments.filter((p) =>
    paymentFilter === 'all' || paymentFilter === 'processing'
      ? paymentFilter === 'all' || ['processing', 'unknown'].includes(p.stage)
      : p.stage === paymentFilter,
  )
  const queueCount = filteredPayments.length

  const amount = money(state.amount)
  const paid = state.stage === 'paid'
  const active = state.stage !== 'idle'
  const fields = getPaymentReviewFields(state)
  const collapseControl = (
    <Button
      variant={collapsed ? 'outline' : 'ghost'}
      size="icon"
      className="proto-collapse"
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-expanded={!collapsed}
      aria-controls="proto-sidebar"
      onClick={() => setCollapsed((v) => !v)}
    >
      {collapsed ? <Sidebar size={16} /> : <SidebarSimple size={16} />}
      <span className="sr-only">
        {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      </span>
    </Button>
  )
  const brand = (
    <div className="proto-brand">
      <BrandMark wordmark={!collapsed || mobile} />
      {!collapsed && !mobile && collapseControl}
    </div>
  )
  const startNewPayment = () => {
    if (transition) return
    setMobile(false)
    transitionTask.run('starting', beginExternal, 800)
  }
  const sidebarPromo = (
    <div className="proto-sidebar-promo">
      <Banner
        tone="inverse"
        title="Pay from your bank"
        description="Pay suppliers without adding money to Clara."
        actions={
          <Button variant="secondary" onClick={startNewPayment}>
            Start payment
            <ArrowRight size={14} />
          </Button>
        }
        visual={<NewPaymentIllustration />}
      />
    </div>
  )
  const navigation = (
    <ProductNavigation
      view={view}
      collapsed={collapsed}
      mobile={mobile}
      openNavGroup={openNavGroup}
      setOpenNavGroup={setOpenNavGroup}
      setCollapsed={setCollapsed}
      navigate={navigate}
      brand={brand}
      sidebarPromo={sidebarPromo}
    />
  )

  const flow = active && flowOpen
  const { approvalReceipt, busyLabel, ...wizardPresentation } =
    getPaymentTaskPresentation({
      stage: state.stage,
      bank: state.bank,
      reviewAsApprover,
      deviceLinked: deviceLink,
      qrOpen,
      editNotice,
      transition,
    })
  const back =
    state.stage === 'connect'
      ? () => send({ type: 'EDIT' })
      : state.stage === 'review'
        ? () => send({ type: 'EDIT', value: 'source' })
        : state.stage === 'bank-connect'
          ? () => send({ type: 'CANCEL_CONNECTION' })
          : state.stage === 'bank'
            ? () => send({ type: 'CANCEL_AUTH' })
            : undefined
  const paymentActions = (
    <PaymentActions
      stage={state.stage}
      transition={transition}
      connected={state.connected}
      deviceLinked={deviceLink}
      reviewAsApprover={reviewAsApprover}
      approvalReceipt={approvalReceipt}
      rejectionOpen={rejectionOpen}
      checking={checking}
      bank={state.bank}
      onContinue={() => send({ type: 'REVIEW' })}
      onConnect={() => {
        setDeviceLink(false)
        send({ type: 'CONNECT' })
      }}
      onReceiveConnection={receiveConnection}
      onConfirmDevice={() => advance({ type: 'CONNECTED' }, 'device')}
      onRequest={() =>
        advance({ type: 'REQUEST' }, 'request', () => {
          setEditNotice('')
          setPaymentFilter('approval')
        })
      }
      onApprove={() =>
        advance({ type: 'APPROVE', actor: 'approver' }, 'approval', () =>
          setPaymentFilter('approval'),
        )
      }
      onShowRejection={setRejectionOpen}
      onReject={() => {
        if (!rejectionReason.trim()) {
          setRejectionError('Enter a reason for the requester.')
          return
        }
        advance(
          { type: 'REJECT', actor: 'approver', value: rejectionReason },
          'rejection',
        )
      }}
      onAuthorize={() => send({ type: 'AUTHORIZE' })}
      onConfirmPayment={() => advance({ type: 'SEND' }, 'authorization')}
      onPayFunded={() => send({ type: 'PAY_FUNDED' })}
      onRetry={() => send({ type: 'RETRY' })}
      onCheck={check}
      onEdit={() => editPayment()}
      onClose={() => setFlowOpen(false)}
      onViewAll={() => {
        setFlowOpen(false)
        setPaymentFilter('all')
      }}
    />
  )
  const visiblePayments = selectPaymentQueue(
    view === 'overview' ? allPayments : filteredPayments,
    {
      query: view === 'overview' ? '' : query,
      source: view === 'overview' ? 'all' : sourceFilter,
      status:
        view !== 'payments' || paymentFilter !== 'all' ? 'all' : statusFilter,
      period: view === 'overview' ? 'all' : periodFilter,
      dateFrom,
      dateTo,
    },
    view === 'overview' ? 'newest' : (sortOrder as PaymentSort),
  )
  const searchMatches = visiblePayments.length
  const pagePayments = visiblePayments.slice(
    tablePage * 10,
    (tablePage + 1) * 10,
  )
  const selectedPayments = allPayments.filter((p) =>
    selectedIds.includes(p.intent),
  )
  const toggleSelection = (intent: string) =>
    setSelectedIds((ids) =>
      ids.includes(intent)
        ? ids.filter((id) => id !== intent)
        : [...ids, intent],
    )
  const selectPage = (
    <Checkbox
      aria-label="Select payments on this page"
      checked={
        pagePayments.length > 0 &&
        pagePayments.every((p) => selectedIds.includes(p.intent))
          ? true
          : pagePayments.some((p) => selectedIds.includes(p.intent))
            ? 'indeterminate'
            : false
      }
      onCheckedChange={(checked) =>
        setSelectedIds((selected) =>
          selectPageIds(
            selected,
            pagePayments.map((p) => p.intent),
            checked === true,
          ),
        )
      }
    />
  )
  const exportSelected = () => {
    const cell = (value: string) => '"' + value.replaceAll('"', '""') + '"'
    const csv = [
      ['Reference', 'Supplier', 'Amount BRL', 'Source', 'Status'],
      ...selectedPayments.map((p) => [
        p.intent,
        p.recipient,
        p.amount,
        p.bank,
        status[p.stage],
      ]),
    ]
      .map((row) => row.map(cell).join(','))
      .join('\n')
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    )
    const link = document.createElement('a')
    link.href = url
    link.download = 'selected-payments.csv'
    link.click()
    URL.revokeObjectURL(url)
  }
  const bulkBar = selectedIds.length > 0 && (
    <SelectionToolbar
      count={selectedIds.length}
      total={money(
        (
          selectedPayments.reduce((sum, p) => sum + amountCents(p.amount), 0) /
          100
        ).toFixed(2),
      )}
      canApprove={view === 'payments' && paymentFilter === 'approval'}
      onApprove={() => {
        setBulkReason('')
        setBulkError('')
        setBulkDecision('approve')
      }}
      onReject={() => {
        setBulkReason('')
        setBulkError('')
        setBulkDecision('reject')
      }}
      onExport={exportSelected}
      onClear={() => setSelectedIds([])}
    />
  )
  const clearFilters = () => {
    setQuery('')
    setSourceFilter('all')
    setStatusFilter('all')
    setPeriodFilter('all')
    setDateFrom('')
    setDateTo('')
    setTablePage(0)
  }
  const filters = (
    <PaymentFilters
      value={{
        query,
        source: sourceFilter,
        period: periodFilter,
        status: statusFilter,
        dateFrom,
        dateTo,
      }}
      showStatus={view === 'payments' && paymentFilter === 'all'}
      open={filtersOpen}
      onOpenChange={setFiltersOpen}
      onReset={clearFilters}
      onChange={(changes) => {
        if (changes.query !== undefined) setQuery(changes.query)
        if (changes.source !== undefined) setSourceFilter(changes.source)
        if (changes.period !== undefined) setPeriodFilter(changes.period)
        if (changes.status !== undefined) setStatusFilter(changes.status)
        if (changes.dateFrom !== undefined) setDateFrom(changes.dateFrom)
        if (changes.dateTo !== undefined) setDateTo(changes.dateTo)
      }}
    />
  )

  const pagination = (total: number) =>
    total > 10 ? (
      <div className="proto-pagination">
        <span className="type-caption">
          {total === 0 ? '0' : tablePage * 10 + 1}–
          {Math.min((tablePage + 1) * 10, total)} of {total} payments
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={tablePage === 0}
          onClick={() => setTablePage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={(tablePage + 1) * 10 >= total}
          onClick={() => setTablePage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    ) : null
  const paymentTable = (
    <PaymentTable
      visiblePayments={visiblePayments}
      overview={view === 'overview'}
      reviewQueue={paymentFilter === 'approval'}
      tablePage={tablePage}
      sortOrder={sortOrder}
      selected={selectedIds}
      total={searchMatches}
      selectPage={selectPage}
      onSort={setSortOrder}
      onSelect={toggleSelection}
      onOpen={openPayment}
      onClearSelection={() => setSelectedIds([])}
    />
  )
  const milestones = [
    { label: 'Request saved', done: true },
    {
      label:
        state.stage === 'rejected'
          ? 'Company review rejected'
          : 'Company approval',
      done: state.approved,
      blocked: state.stage === 'rejected',
    },
    {
      label: 'Payment authorized',
      done: ['processing', 'unknown', 'paid', 'failed'].includes(state.stage),
    },
    {
      label: state.stage === 'failed' ? 'Payment failed' : 'Payment confirmed',
      done: paid,
      blocked: state.stage === 'failed',
    },
  ]
  const nextMilestone = milestones.findIndex((item) => !item.done)
  const requestProgress = (
    <ol className="proto-request-progress" aria-label="Request progress">
      {milestones.map((item, index) => (
        <li
          key={index}
          className={
            item.blocked
              ? 'blocked'
              : item.done
                ? 'done'
                : index === nextMilestone
                  ? 'current'
                  : ''
          }
          aria-current={
            !item.blocked && index === nextMilestone ? 'step' : undefined
          }
        >
          <span aria-hidden="true">
            {item.blocked ? (
              <Info size={14} />
            ) : item.done ? (
              <Check size={14} />
            ) : (
              <Clock size={14} />
            )}
          </span>
          <span>{item.label}</span>
          <span className="sr-only">
            {' '}
            ·{' '}
            {item.blocked
              ? 'Stopped'
              : item.done
                ? 'Completed'
                : index === nextMilestone
                  ? 'Next'
                  : 'Not completed'}
          </span>
        </li>
      ))}
    </ol>
  )

  const trackingSidebar = [
    'approval',
    'authorize',
    'bank',
    'processing',
    'unknown',
    'paid',
    'failed',
    'rejected',
  ].includes(state.stage) ? (
    <div className="proto-tracking-column">
      <Stack gap={16}>
        <h3 className="type-h3">Payment progress</h3>
        {requestProgress}
        <Separator />
        <h3 className="type-h3">History</h3>
        {state.events.length ? (
          <Timeline
            events={[...state.events]
              .reverse()
              .map((e) => ({ ...e, date: displayDate(e.dateTime) }))}
          />
        ) : (
          <p className="type-caption">No recorded events yet.</p>
        )}
      </Stack>
    </div>
  ) : undefined
  return (
    <TooltipProvider>
      <div className={`proto-root ${embedded ? 'proto-embedded' : ''}`}>
        {!embedded && (
          <Toaster position={compact ? 'top-center' : 'bottom-right'} />
        )}
        <a className="skip-link" href="#proto-main">
          Skip to workspace
        </a>
        <div
          className={`proto-shell ${collapsed ? 'proto-shell-collapsed' : ''}`}
        >
          <aside id="proto-sidebar" className="proto-sidebar">
            {brand}
            <ScrollArea className="proto-navigation-scroll">
              {navigation}
            </ScrollArea>
            {!collapsed && sidebarPromo}
            {collapsed && collapseControl}
            <div className="proto-global-settings" aria-disabled="true">
              <Gear size={16} />
              {!collapsed && <span>Settings</span>}
            </div>
            <div className="proto-user">
              <Avatar
                name={reviewAsApprover ? 'Carlos Almeida' : 'Nágela Carvalho'}
              />
              {!collapsed && (
                <span className="type-ui">
                  {reviewAsApprover ? 'Carlos · Approver' : 'Nágela · Finance'}
                </span>
              )}
            </div>
          </aside>
          <div className="proto-main-shell">
            <ScrollArea className="proto-content-scroll">
              <main id="proto-main" tabIndex={-1} className="proto-content">
                <div
                  ref={heading}
                  tabIndex={-1}
                  className={`proto-heading ${reviewAsApprover ? 'proto-heading-with-tabs' : ''}`}
                >
                  <PageHeader
                    title={
                      view === 'accounts'
                        ? 'Connected banks'
                        : view === 'overview'
                          ? 'Accounts payable overview'
                          : 'Payments'
                    }
                    titleLevel={embedded ? 2 : 1}
                    leading={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="proto-mobile-menu"
                        aria-label="Open product navigation"
                        onClick={() => setMobile(true)}
                      >
                        <List size={16} />
                      </Button>
                    }
                    description={
                      view === 'accounts'
                        ? 'Use your existing business bank accounts to pay suppliers through Clara.'
                        : undefined
                    }
                    actions={
                      view === 'payments' ? (
                        <FundingMenu onExternal={startNewPayment} />
                      ) : undefined
                    }
                    primaryAction={
                      view === 'accounts' && state.accounts.length
                        ? {
                            label: 'Connect bank account',
                            onClick: () => setSetup('choose'),
                          }
                        : undefined
                    }
                  />
                </div>
                <Separator />

                <div key={view} className="proto-page-enter">
                  <WorkspaceViews
                    view={view}
                    accounts={state.accounts}
                    allPayments={allPayments}
                    paymentFilter={paymentFilter}
                    queueCount={queueCount}
                    searchMatches={searchMatches}
                    paymentTable={paymentTable}
                    filters={filters}
                    bulkBar={bulkBar}
                    pagination={pagination(searchMatches)}
                    onQueue={(scope) => {
                      if (view === 'overview') clearFilters()
                      setPaymentFilter(scope)
                      setReviewAsApprover(scope === 'approval')
                      if (view !== 'payments') navigate('payments')
                    }}
                    onViewAll={() => {
                      setQuery('')
                      setPaymentFilter('all')
                      navigate('payments')
                    }}
                    onNewPayment={startNewPayment}
                    onPayFrom={payFrom}
                    onConnect={() => setSetup('choose')}
                    onClearFilters={clearFilters}
                  />
                </div>
              </main>
            </ScrollArea>
          </div>
        </div>
        <Wizard
          footerContent={
            state.stage === 'approval' && reviewAsApprover && rejectionOpen ? (
              <section className="proto-rejection-form">
                <Stack gap={8}>
                  <Label htmlFor="proto-rejection">Reason for rejection</Label>
                  <Textarea
                    ref={rejectionField}
                    id="proto-rejection"
                    aria-invalid={!!rejectionError}
                    aria-describedby="proto-rejection-help"
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value)
                      setRejectionError('')
                    }}
                  />
                  <p
                    id="proto-rejection-help"
                    className="type-caption"
                    role={rejectionError ? 'alert' : undefined}
                  >
                    {rejectionError ||
                      'The requester will see this reason and can correct the request.'}
                  </p>
                </Stack>
              </section>
            ) : undefined
          }
          sideContent={trackingSidebar}
          {...wizardPresentation}
          busyContent={
            busyLabel ? <BrandLoading label={busyLabel} /> : undefined
          }
          open={flow}
          onOpenChange={(value) => {
            if (!transition && state.stage !== 'processing') {
              setFlowOpen(value)
              if (!value) setQrOpen(false)
            }
          }}
          titleLeading={<BrandMark />}
          context={
            approvalReceipt ||
            ['entry', 'approval', 'paid'].includes(state.stage) ? undefined : (
              <div className="proto-route">
                <Bank size={16} />
                <span>{state.bank}</span>
                <ArrowRight size={16} />
                {state.path === 'topup' && (
                  <>
                    <span>Clara account</span>
                    <ArrowRight size={16} />
                  </>
                )}
                <span>{state.recipient || 'Supplier'}</span>
                <strong>{amount}</strong>
              </div>
            )
          }
          actions={
            qrOpen ? (
              <Button
                onClick={() => {
                  send({ type: 'FIELD', field: 'key', value: demoPixCode })
                  setQrOpen(false)
                }}
              >
                Simulate QR reading
                <ArrowRight size={16} />
              </Button>
            ) : (
              paymentActions
            )
          }
          onBack={
            qrOpen ? () => setQrOpen(false) : transition ? undefined : back
          }
        >
          <Stack
            key={qrOpen ? 'scanner' : state.stage}
            gap={16}
            className={
              (paid || approvalReceipt
                ? 'proto-phase-enter proto-completion-body'
                : 'proto-phase-enter') +
              (transition &&
              [
                'request',
                'approval',
                'authorization',
                'device',
                'rejection',
              ].includes(transition)
                ? ' proto-finalizing'
                : '')
            }
          >
            {transition === 'editing' && (
              <div className="proto-edit-feedback" role="status">
                <Spinner />
                <span>Opening saved details…</span>
              </div>
            )}
            {editNotice && ['entry', 'connect'].includes(state.stage) && (
              <div className="proto-edit-feedback" role="status">
                <Info size={16} />
                <p className="type-ui">{editNotice}</p>
              </div>
            )}
            {state.notice && state.stage === 'authorize' && (
              <Alert className="proto-interruption">
                <Info size={16} />
                <AlertTitle>Payment authorization canceled</AlertTitle>
                <AlertDescription>
                  {state.notice} Select Authorize payment to try again.
                </AlertDescription>
              </Alert>
            )}
            {state.error && state.stage !== 'entry' && (
              <Alert variant="destructive">
                <AlertTitle>Check this step</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            {(state.stage === 'connect' || state.stage === 'bank-connect') && (
              <SourceAccountStep
                phase={state.stage}
                bank={state.bank}
                connected={state.connected}
                accounts={state.accounts}
                deviceLinked={deviceLink}
                receiving={transition === 'connection'}
                onBankChange={(bank) => send({ type: 'BANK', bank })}
              />
            )}
            {state.stage === 'entry' && qrOpen && <PixQrInput />}
            {state.stage === 'entry' && !qrOpen && (
              <PaymentDetailsStep
                details={state}
                busy={!!transition}
                findingRecipient={transition === 'lookup'}
                onLookup={() => advance({ type: 'LOOKUP' }, 'lookup')}
                onScanQr={() => setQrOpen(true)}
                onFieldChange={(field, value) =>
                  send({ type: 'FIELD', field, value })
                }
                onContextChange={(field, value) =>
                  send({ type: 'CONTEXT', field, value })
                }
              />
            )}
            {state.stage === 'review' && (
              <>
                <PaymentReview
                  title="Review your request"
                  fields={{
                    ...fields,
                    context: [
                      ...fields.context,
                      {
                        label: 'Company policy',
                        value: 'Supplier payments · Carlos reviews',
                      },
                    ],
                  }}
                />
                <div className="proto-case-actions">
                  <Button
                    variant="link"
                    disabled={!!transition}
                    onClick={() => editPayment()}
                  >
                    Edit recipient or amount
                  </Button>
                  <Button
                    variant="link"
                    disabled={!!transition}
                    onClick={() => editPayment(true)}
                  >
                    Change account
                  </Button>
                </div>
              </>
            )}
            <PaymentOutcome
              state={state}
              fields={fields}
              reviewAsApprover={reviewAsApprover}
              approvalReceipt={approvalReceipt}
            />
          </Stack>
        </Wizard>

        <BankConnectionWizard
          setup={setup}
          setSetup={setSetup}
          setupBank={setupBank}
          setSetupBank={setSetupBank}
          setupError={setupError}
          transition={transition}
          advanceSetup={advanceSetup}
        />
        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetContent side="left" className="proto-mobile-navigation">
            <SheetTitle className="sr-only">Product navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Finance workspace sections
            </SheetDescription>
            {navigation}
          </SheetContent>
        </Sheet>
        <Button
          className="proto-scenario-fab"
          variant="outline"
          onClick={() => setControls(true)}
          aria-label="Explore prototype scenarios"
        >
          <ListChecks size={18} />
          <span>
            Scenarios
            {activeScenario
              ? ' · ' +
                scenarioOptions.find((o) => o.id === activeScenario)?.hypothesis
              : ''}
          </span>
        </Button>

        <Dialog open={promoStarting}>
          <DialogContent
            className="proto-promo-loading"
            showCloseButton={false}
            aria-describedby={undefined}
          >
            <DialogTitle className="sr-only">Starting supplier Pix</DialogTitle>
            <BrandLoading label="Preparing your payment" />
          </DialogContent>
        </Dialog>
        <ScenarioExplorer
          open={controls}
          onOpenChange={setControls}
          outcome={scenario}
          onOutcomeChange={setScenario}
          onScenario={launchScenario}
          onWorkspace={(value) => {
            loadData(value)
            setActiveScenario(null)
            setControls(false)
          }}
          onPixExample={() => {
            setReviewAsApprover(false)
            setQrOpen(false)
            send({ type: 'LOAD_SCENARIO', value: 'first' })
            send({
              type: 'FIELD',
              field: 'key',
              value: demoPixCode,
            })
            setControls(false)
            setView('payments')
            setPaymentFilter('all')
            setFlowOpen(true)
          }}
        />
        <AlertDialog
          open={bulkDecision !== null}
          onOpenChange={(open) => {
            if (!open) setBulkDecision(null)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {bulkDecision === 'approve' ? 'Approve' : 'Reject'}{' '}
                {selectedIds.length} requests?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {bulkDecision === 'approve'
                  ? 'This records company approval for each selected request. Each Pix still requires individual payment authorization.'
                  : 'Each requester receives this reason and can correct and resubmit their request.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="proto-bulk-review">
              <Stack gap={8}>
                {selectedPayments.map((p) => (
                  <div key={p.intent} className="proto-bulk-review-row">
                    <span>
                      <strong>{p.recipient}</strong>
                      <span className="type-caption">
                        {p.intent} · {p.bank}
                      </span>
                    </span>
                    <strong>{money(p.amount)}</strong>
                  </div>
                ))}
              </Stack>
            </ScrollArea>
            {bulkDecision === 'reject' && (
              <Stack gap={4}>
                <Label htmlFor="bulk-reason">Reason for rejection</Label>
                <Textarea
                  id="bulk-reason"
                  value={bulkReason}
                  aria-invalid={!!bulkError}
                  aria-describedby="bulk-error"
                  onChange={(e) => {
                    setBulkReason(e.target.value)
                    setBulkError('')
                  }}
                />
                <p
                  id="bulk-error"
                  className="type-caption"
                  role={bulkError ? 'alert' : undefined}
                >
                  {bulkError || 'This reason applies to all selected requests.'}
                </p>
              </Stack>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Keep reviewing</AlertDialogCancel>
              <Button
                variant={bulkDecision === 'reject' ? 'destructive' : 'default'}
                onClick={() => {
                  if (bulkDecision === 'reject' && !bulkReason.trim()) {
                    setBulkError(
                      'Enter a reason before rejecting these requests.',
                    )
                    return
                  }
                  if (bulkDecision) {
                    send({
                      type: 'BULK_DECISION',
                      intents: selectedIds,
                      decision: bulkDecision,
                      reason: bulkReason,
                      actor: 'approver',
                    })
                    toast(
                      `${selectedIds.length} requests ${bulkDecision === 'approve' ? 'approved' : 'rejected'}`,
                      {
                        description:
                          bulkDecision === 'approve'
                            ? 'Each payment still requires individual authorization.'
                            : 'Requesters can correct and resubmit their requests.',
                      },
                    )
                    setSelectedIds([])
                    setBulkDecision(null)
                  }
                }}
              >
                Confirm {bulkDecision === 'approve' ? 'approval' : 'rejection'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
