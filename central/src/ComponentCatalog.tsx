import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowUpRight,
  FileText,
  DotsThreeVertical,
  Copy,
  Info,
  MagnifyingGlass,
  Repeat,
} from '@phosphor-icons/react'
import * as UI from '@/design-system'
const sources = import.meta.glob('./components/**/*.tsx', {
  query: '?raw',
  import: 'default',
})
const layoutSource = () =>
  import('./design-system/layout.tsx?raw').then((m) => m.default)
export const componentSlug = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
const options = [
  { value: 'clara', label: 'Clara account' },
  { value: 'banco-a', label: 'Bank A · business account' },
  { value: 'banco-b', label: 'Bank B · business account' },
  { value: 'blocked', label: 'Account unavailable', disabled: true },
]
const rows = [
  {
    id: '1',
    beneficiary: 'Example Supplier',
    value: 1750,
    status: 'Pending approval',
  },
  { id: '2', beneficiary: 'Beta Services', value: 320, status: 'Paid' },
  {
    id: '3',
    beneficiary: 'Gamma Distributors',
    value: 890,
    status: 'Processing',
  },
  { id: '4', beneficiary: 'Delta Consulting', value: 120, status: 'Failed' },
  { id: '5', beneficiary: 'Epsilon Company', value: 210, status: 'Paid' },
  { id: '6', beneficiary: 'Zeta Supplier', value: 90, status: 'Paid' },
]
const events = [
  {
    id: '1',
    title: 'Request created',
    actor: 'Ana · requester',
    date: 'Oct 13, 10:00',
    dateTime: '2026-10-13T10:00:00-03:00',
  },
  {
    id: '2',
    title: 'Approval recorded',
    actor: 'Carlos · approver',
    date: 'Oct 13, 10:15',
    dateTime: '2026-10-13T10:15:00-03:00',
    description:
      'Final internal approval; execution still depends on the applicable authorization.',
  },
]
const fields = [
  { label: 'Beneficiary', value: 'Example Supplier Ltd.' },
  { label: 'Amount', value: 'R$ 1.750,00' },
  { label: 'Source', value: 'Example account' },
  { label: 'Method', value: 'Pix' },
]
function LoadingDemo() {
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  return (
    <UI.Stack gap={8}>
      <UI.Button
        loading={loading}
        loadingLabel="Saving example"
        onClick={() => {
          setLoading(true)
          timer.current = setTimeout(() => {
            setLoading(false)
            UI.toast.success('Example saved', {
              description: 'Local simulation; no external operation.',
            })
          }, 1400)
        }}
      >
        Save example
      </UI.Button>
      <p className="type-caption">
        1.4 s local simulation · size preserved · repeated clicks blocked.
      </p>
    </UI.Stack>
  )
}
function ExampleCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="component-example-card">
      <h2 className="type-h3">{title}</h2>
      <div className="example-card-body">{children}</div>
    </section>
  )
}
function SourceCode({ name }: { name: string }) {
  const [code, setCode] = useState(''),
    [error, setError] = useState(false)
  const entry = UI.designSystem.components.find((c) => c.name === name)!
  useEffect(() => {
    let active = true
    setCode('')
    setError(false)
    const load =
      sources[entry.file.replace('src/', './')] ??
      (entry.file === 'src/design-system/layout.tsx' ? layoutSource : undefined)
    if (!load) {
      setError(true)
      return
    }
    load()
      .then((value) => {
        if (active) setCode(String(value))
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [entry.file])
  return (
    <UI.Stack gap={8}>
      <UI.Inline gap={8} className="source-toolbar">
        <code>{entry.file}</code>
        <UI.Button
          size="sm"
          variant="outline"
          disabled={!code}
          onClick={() =>
            navigator.clipboard
              .writeText(code)
              .then(() => UI.toast.success('Code copied'))
              .catch(() => UI.toast.error('Could not copy'))
          }
        >
          <Copy size={12} />
          Copy
        </UI.Button>
      </UI.Inline>
      {error ? (
        <UI.Alert variant="destructive">
          <UI.AlertTitle>Could not load the code.</UI.AlertTitle>
        </UI.Alert>
      ) : code ? (
        <UI.ScrollArea className="ds-code-scroll">
          <pre>
            <code>{code}</code>
          </pre>
        </UI.ScrollArea>
      ) : (
        <UI.ContentSkeleton label="Loading code" />
      )}
    </UI.Stack>
  )
}
function ComponentDemo({ name }: { name: string }) {
  const [value, setValue] = useState('clara'),
    [checked, setChecked] = useState(false),
    [text, setText] = useState(''),
    [date, setDate] = useState<Date>(),
    [step, setStep] = useState(1),
    [chip, setChip] = useState(true),
    [selected, setSelected] = useState(false),
    [otp, setOtp] = useState(''),
    [, setFile] = useState<File | null>(null),
    [dialog, setDialog] = useState(false),
    [page, setPage] = useState(1)
  const notify = (label: string) =>
    UI.toast.info(label, { description: 'Local design system example.' })
  const action = { label: 'Continue', onClick: () => notify('Primary action') },
    secondary = { label: 'Back', onClick: () => notify('Secondary action') },
    overflow = [
      { label: 'View history', onClick: () => notify('History') },
      { label: 'Export', onClick: () => notify('Example export') },
    ]
  const menu = (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger asChild>
        <UI.Button variant="outline">
          Options <DotsThreeVertical size={16} />
        </UI.Button>
      </UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent align="start">
        <UI.DropdownMenuLabel>Example actions</UI.DropdownMenuLabel>
        <UI.DropdownMenuItem onSelect={() => notify('Edit selected')}>
          Edit
        </UI.DropdownMenuItem>
        <UI.DropdownMenuItem onSelect={() => notify('History selected')}>
          View history
        </UI.DropdownMenuItem>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuItem disabled>Export unavailable</UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
  const tabs = (variant: 'pill' | 'line') => (
    <UI.Tabs defaultValue="overview">
      <UI.TabsList variant={variant}>
        <UI.TabsTrigger value="overview">Overview</UI.TabsTrigger>
        <UI.TabsTrigger value="pending">Pending</UI.TabsTrigger>
        <UI.TabsTrigger value="disabled" disabled>
          Unavailable
        </UI.TabsTrigger>
      </UI.TabsList>
      <UI.TabsContent value="overview">
        <p className="type-ui">Overview content.</p>
      </UI.TabsContent>
      <UI.TabsContent value="pending">
        <p className="type-ui">Pending requests content.</p>
      </UI.TabsContent>
    </UI.Tabs>
  )
  const table = (
    <UI.DataTable
      rows={rows}
      pageSize={3}
      label="Payments"
      columns={[
        { key: 'beneficiary', label: 'Beneficiary' },
        {
          key: 'value',
          label: 'Amount',
          numeric: true,
          render: (r) =>
            Number(r.value).toLocaleString('en-US', {
              style: 'currency',
              currency: 'BRL',
            }),
        },
        {
          key: 'status',
          label: 'Status',
          render: (r) => (
            <UI.PaymentStatus state={r.status as UI.PaymentState} />
          ),
        },
      ]}
    />
  )
  switch (name) {
    case 'Pressable':
      return (
        <UI.Pressable
          onClick={() => notify('Row selected')}
          className="pressable-example"
        >
          <FileText size={16} />
          Open example document
          <ArrowUpRight size={16} />
        </UI.Pressable>
      )
    case 'Button':
      return (
        <div className="component-preview-grid">
          <ExampleCard title="Variants">
            <UI.Inline gap={8}>
              {(
                [
                  { variant: 'default', label: 'Continue' },
                  { variant: 'outline', label: 'Back' },
                  { variant: 'secondary', label: 'Save draft' },
                  { variant: 'ghost', label: 'View details' },
                  { variant: 'destructive', label: 'Delete example' },
                ] as const
              ).map(({ variant, label }) => (
                <div className="variant-example" key={variant}>
                  <UI.Button variant={variant} onClick={() => notify(label)}>
                    {label}
                  </UI.Button>
                  <code>{variant}</code>
                </div>
              ))}
            </UI.Inline>
          </ExampleCard>
          <ExampleCard title="Sizes and states">
            <UI.Inline gap={8}>
              <div className="variant-example">
                <UI.Button size="md">Medium</UI.Button>
                <span>32 px</span>
              </div>
              <div className="variant-example">
                <UI.Button size="lg">Grande</UI.Button>
                <span>40 px</span>
              </div>
              <div className="variant-example">
                <UI.Button
                  variant="outline"
                  size="icon"
                  aria-label="More example options"
                  onClick={() => notify('Options')}
                >
                  <DotsThreeVertical size={16} />
                </UI.Button>
                <span>Icon · 32 px</span>
              </div>
              <div className="variant-example">
                <UI.Button disabled>Unavailable</UI.Button>
                <span>disabled</span>
              </div>
            </UI.Inline>
          </ExampleCard>
          <ExampleCard title="Loading">
            <LoadingDemo />
          </ExampleCard>
          <ExampleCard title="Links and text actions">
            <UI.Stack gap={8}>
              <UI.Inline gap={8}>
                <UI.Button variant="link" asChild>
                  <a href="#/patterns">
                    View patterns <ArrowUpRight size={16} />
                  </a>
                </UI.Button>
                <UI.Button
                  variant="link"
                  onClick={() => notify('Example details')}
                >
                  Ver detalhes do exemplo
                </UI.Button>
              </UI.Inline>
              <p className="type-caption">
                Navigation uses href; actions use onClick. Both preserve visible
                focus.
              </p>
            </UI.Stack>
          </ExampleCard>
        </div>
      )
    case 'HeaderActions':
      return (
        <UI.HeaderActions
          primary={action}
          secondary={secondary}
          overflow={overflow}
        />
      )
    case 'PageHeader':
      return (
        <UI.Tabs
          value={['plain', 'subtle', 'brand'].includes(value) ? value : 'brand'}
          onValueChange={setValue}
        >
          <UI.TabsList variant="line">
            {(['plain', 'subtle', 'brand'] as const).map((tone) => (
              <UI.TabsTrigger key={tone} value={tone}>
                {tone === 'plain'
                  ? 'No background'
                  : tone === 'subtle'
                    ? 'Neutral'
                    : 'Subtle color'}
              </UI.TabsTrigger>
            ))}
          </UI.TabsList>
          {(['plain', 'subtle', 'brand'] as const).map((tone) => (
            <UI.TabsContent key={tone} value={tone}>
              <UI.PageHeader
                tone={tone}
                title="Payments"
                description="Functional title, optional description and related actions."
                titleLevel={2}
                primaryAction={action}
                secondaryAction={secondary}
                overflowActions={overflow}
              />
            </UI.TabsContent>
          ))}
        </UI.Tabs>
      )
    case 'DropdownMenu':
      return menu
    case 'Popover':
      return (
        <UI.Popover>
          <UI.PopoverTrigger asChild>
            <UI.Button variant="outline">Open context</UI.Button>
          </UI.PopoverTrigger>
          <UI.PopoverContent>
            <UI.Stack gap={4}>
              <h3 className="type-h3">Contextual information</h3>
              <p className="type-ui">The component handles focus and Escape.</p>
            </UI.Stack>
          </UI.PopoverContent>
        </UI.Popover>
      )
    case 'Tooltip':
      return (
        <UI.Tooltip>
          <UI.TooltipTrigger asChild>
            <UI.Button
              size="icon"
              variant="outline"
              aria-label="About approvals"
            >
              <Info size={16} />
            </UI.Button>
          </UI.TooltipTrigger>
          <UI.TooltipContent>
            Internal approval precedes execution.
          </UI.TooltipContent>
        </UI.Tooltip>
      )
    case 'Chip':
      return (
        <UI.Inline gap={8}>
          <UI.Chip selected={selected} onToggle={() => setSelected(!selected)}>
            Pending
          </UI.Chip>
          {chip ? (
            <UI.Chip onRemove={() => setChip(false)}>Method: Pix</UI.Chip>
          ) : (
            <UI.Button
              variant="outline"
              size="sm"
              onClick={() => setChip(true)}
            >
              Restore filter
            </UI.Button>
          )}
          <UI.Chip disabled onToggle={() => {}}>
            Unavailable
          </UI.Chip>
        </UI.Inline>
      )
    case 'Field':
      return (
        <UI.Field data-invalid={text.length > 0 && text.length < 3}>
          <UI.FieldLabel htmlFor="field-beneficiary">Beneficiary</UI.FieldLabel>
          <UI.Input
            id="field-beneficiary"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={text.length > 0 && text.length < 3}
            aria-describedby="field-description"
          />
          <UI.FieldDescription id="field-description">
            Enter at least 3 characters.
          </UI.FieldDescription>
          {text.length > 0 && text.length < 3 && (
            <UI.FieldError>The name is incomplete.</UI.FieldError>
          )}
        </UI.Field>
      )
    case 'Label':
      return (
        <UI.Stack gap={4}>
          <UI.Label htmlFor="label-example">Payment reference</UI.Label>
          <UI.Input id="label-example" placeholder="E.g. service agreement" />
        </UI.Stack>
      )
    case 'Banner':
      return (
        <UI.Stack gap={16}>
          {chip ? (
            <UI.Banner
              title="New automatic payments for your credit line"
              description="Use your Digital Account to automate payments and keep your balance available."
              primaryAction={{
                label: 'Get started',
                onClick: () => notify('Get started · example'),
              }}
              secondaryAction={{
                label: 'Later',
                onClick: () => setChip(false),
              }}
              visual={
                <div className="banner-demo-visual">
                  <div>
                    <Repeat size={40} />
                  </div>
                </div>
              }
            />
          ) : (
            <UI.Button variant="outline" onClick={() => setChip(true)}>
              Restore banner
            </UI.Button>
          )}
          <UI.Banner
            tone="brand"
            title="Connect your funding account"
            description="Keep the account choice within the payment context."
            primaryAction={{
              label: 'View accounts',
              onClick: () => notify('Accounts · example'),
            }}
          />
        </UI.Stack>
      )
    case 'InputGroup':
      return (
        <UI.Stack gap={16}>
          <UI.InputGroup
            leadingIcon={<MagnifyingGlass size={16} />}
            aria-label="Example search"
            placeholder="Filter screens…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            trailing={
              text ? (
                <UI.Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Clear example search"
                  onClick={() => setText('')}
                >
                  ×
                </UI.Button>
              ) : undefined
            }
          />
          <UI.InputGroup
            controlSize="lg"
            leadingIcon={<MagnifyingGlass size={16} />}
            aria-label="Large search"
            placeholder="Search · 40 px"
          />
        </UI.Stack>
      )
    case 'Input':
      return (
        <UI.Stack gap={16}>
          <UI.Stack gap={4}>
            <UI.Label htmlFor="input-md">Medium · 32 px</UI.Label>
            <UI.Input
              id="input-md"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter a value"
            />
          </UI.Stack>
          <UI.Stack gap={4}>
            <UI.Label htmlFor="input-lg">Large · 40 px</UI.Label>
            <UI.Input
              id="input-lg"
              controlSize="lg"
              placeholder="Enter a value"
            />
          </UI.Stack>
          <UI.Input
            disabled
            aria-label="Disabled input"
            placeholder="Unavailable"
          />
          <UI.Input
            aria-invalid
            aria-label="Input with error"
            defaultValue="Invalid value"
          />
        </UI.Stack>
      )
    case 'Textarea':
      return (
        <UI.Stack gap={4}>
          <UI.Label htmlFor="notes-example">Note</UI.Label>
          <UI.Textarea
            id="notes-example"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Review context"
          />
        </UI.Stack>
      )
    case 'Select':
      return (
        <UI.Stack gap={4} className="control-example">
          <UI.Label htmlFor="method-select">Method</UI.Label>
          <UI.Select
            value={value === 'clara' ? 'pix' : value}
            onValueChange={setValue}
          >
            <UI.SelectTrigger id="method-select">
              <UI.SelectValue placeholder="Select method" />
            </UI.SelectTrigger>
            <UI.SelectContent>
              <UI.SelectItem value="pix">Pix</UI.SelectItem>
              <UI.SelectItem value="boleto">Boleto</UI.SelectItem>
              <UI.SelectItem value="disabled" disabled>
                Unavailable
              </UI.SelectItem>
            </UI.SelectContent>
          </UI.Select>
        </UI.Stack>
      )
    case 'Combobox':
      return (
        <UI.Stack gap={4}>
          <span className="type-ui">Funding account</span>
          <UI.Combobox
            label="Funding account"
            options={options}
            value={value}
            onChange={setValue}
          />
          <p className="type-caption">
            Search, keyboard selection and unavailable option.
          </p>
        </UI.Stack>
      )
    case 'Checkbox':
      return (
        <UI.Stack gap={8}>
          <UI.Inline gap={8}>
            <UI.Checkbox
              id="check-demo"
              checked={checked}
              onCheckedChange={(v) => setChecked(v === true)}
            />
            <UI.Label htmlFor="check-demo">Include receipt</UI.Label>
          </UI.Inline>
          <UI.Inline gap={8}>
            <UI.Checkbox id="check-mixed" checked="indeterminate" />
            <UI.Label htmlFor="check-mixed">Partial selection</UI.Label>
          </UI.Inline>
          <UI.Inline gap={8}>
            <UI.Checkbox disabled id="check-disabled" />
            <UI.Label htmlFor="check-disabled">Unavailable</UI.Label>
          </UI.Inline>
        </UI.Stack>
      )
    case 'RadioGroup':
      return (
        <UI.RadioGroup
          value={value}
          onValueChange={setValue}
          aria-label="Payment account"
        >
          {options.map((o) => (
            <UI.Inline gap={8} key={o.value}>
              <UI.RadioGroupItem
                value={o.value}
                id={`radio-${o.value}`}
                disabled={o.disabled}
              />
              <UI.Label htmlFor={`radio-${o.value}`}>{o.label}</UI.Label>
            </UI.Inline>
          ))}
        </UI.RadioGroup>
      )
    case 'Switch':
      return (
        <UI.Stack gap={8}>
          <UI.Inline gap={8}>
            <UI.Switch
              id="switch-demo"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <UI.Label htmlFor="switch-demo">Receive notifications</UI.Label>
          </UI.Inline>
          <UI.Inline gap={8}>
            <UI.Switch disabled id="switch-disabled" />
            <UI.Label htmlFor="switch-disabled">Unavailable</UI.Label>
          </UI.Inline>
          <p className="type-caption">
            Switch changes a preference; checkbox records a selection.
          </p>
        </UI.Stack>
      )
    case 'Calendar':
      return <UI.Calendar mode="single" selected={date} onSelect={setDate} />
    case 'DatePicker':
      return <UI.DatePicker value={date} onChange={setDate} />
    case 'InputOTP':
      return (
        <UI.Stack gap={8}>
          <UI.Label htmlFor="otp-example">Verification code · example</UI.Label>
          <UI.InputOTP
            id="otp-example"
            value={otp}
            onChange={setOtp}
            maxLength={6}
          >
            <UI.InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <UI.InputOTPSlot key={i} index={i} />
              ))}
            </UI.InputOTPGroup>
          </UI.InputOTP>
          <p className="type-caption">No real code is sent.</p>
        </UI.Stack>
      )
    case 'FileUpload':
      return (
        <UI.Stack gap={24}>
          <UI.Stack gap={8}>
            <h2 className="type-h3">Upload area</h2>
            <UI.FileUpload onChange={setFile} variant="dropzone" />
          </UI.Stack>
          <UI.Stack gap={8}>
            <h2 className="type-h3">Inline upload</h2>
            <UI.FileUpload onChange={setFile} variant="inline" />
          </UI.Stack>
          <UI.Stack gap={8}>
            <h2 className="type-h3">Compacto</h2>
            <UI.FileUpload onChange={setFile} variant="compact" />
          </UI.Stack>
        </UI.Stack>
      )
    case 'Tabs':
      return (
        <UI.Stack gap={24}>
          <UI.Stack gap={8}>
            <h3 className="type-h3">Pill</h3>
            {tabs('pill')}
          </UI.Stack>
          <UI.Stack gap={8}>
            <h3 className="type-h3">Line</h3>
            {tabs('line')}
          </UI.Stack>
        </UI.Stack>
      )
    case 'Sheet':
      return (
        <>
          <UI.Button variant="outline" onClick={() => setDialog(true)}>
            Open side panel
          </UI.Button>
          <UI.Sheet open={dialog} onOpenChange={setDialog}>
            <UI.SheetContent>
              <UI.SheetHeader>
                <UI.SheetTitle>Request detail</UI.SheetTitle>
                <UI.SheetDescription>
                  Contextual panel example.
                </UI.SheetDescription>
              </UI.SheetHeader>
              <UI.ScrollArea className="sheet-body">
                <UI.ReviewSummary fields={fields} />
              </UI.ScrollArea>
              <UI.SheetFooter>
                <UI.Button variant="outline" onClick={() => setDialog(false)}>
                  Close panel
                </UI.Button>
              </UI.SheetFooter>
            </UI.SheetContent>
          </UI.Sheet>
        </>
      )
    case 'ScrollArea':
      return (
        <UI.ScrollArea type="always" className="scroll-demo">
          {Array.from({ length: 20 }, (_, i) => (
            <div className="scroll-demo-row" key={i}>
              Registro {String(i + 1).padStart(2, '0')}
            </div>
          ))}
        </UI.ScrollArea>
      )
    case 'Command':
      return (
        <UI.Command className="command-demo">
          <UI.CommandInput placeholder="Search actions…" />
          <UI.CommandList>
            <UI.CommandEmpty>No results.</UI.CommandEmpty>
            <UI.CommandGroup heading="Actions">
              {['New payment', 'View history', 'View receipt'].map((label) => (
                <UI.CommandItem key={label} onSelect={() => notify(label)}>
                  {label}
                </UI.CommandItem>
              ))}
            </UI.CommandGroup>
          </UI.CommandList>
        </UI.Command>
      )
    case 'Pagination':
      return (
        <UI.Stack gap={8}>
          <UI.Pagination>
            <UI.PaginationContent>
              {[1, 2, 3].map((p) => (
                <UI.PaginationItem key={p}>
                  <UI.PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(p)
                    }}
                  >
                    {p}
                  </UI.PaginationLink>
                </UI.PaginationItem>
              ))}
            </UI.PaginationContent>
          </UI.Pagination>
          <p className="type-caption">Selected page: {page}</p>
        </UI.Stack>
      )
    case 'Wizard':
      return (
        <>
          <UI.Button onClick={() => setDialog(true)}>
            Open payment wizard
          </UI.Button>
          <UI.Wizard
            open={dialog}
            onOpenChange={setDialog}
            title={
              ['Choose account', 'Review recipient', 'Review request'][step]
            }
            steps={['Account', 'Recipient', 'Review']}
            current={step}
            onBack={step ? () => setStep(step - 1) : undefined}
          >
            <UI.Stack gap={16}>
              <p className="type-ui">
                One task per phase. The service controls whether the next phase
                is available.
              </p>
              <UI.Button
                disabled={step === 2}
                onClick={() => setStep(step + 1)}
              >
                Continue
              </UI.Button>
            </UI.Stack>
          </UI.Wizard>
        </>
      )
    case 'Stepper':
      return (
        <UI.Stack gap={16}>
          <UI.Stepper
            steps={['Beneficiary', 'Review', 'Outcome']}
            current={step}
          />
          <UI.Inline gap={8}>
            <UI.Button
              variant="outline"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
            >
              Previous
            </UI.Button>
            <UI.Button disabled={step === 2} onClick={() => setStep(step + 1)}>
              Next stage
            </UI.Button>
          </UI.Inline>
        </UI.Stack>
      )
    case 'Item':
      return (
        <UI.ItemGroup>
          <UI.Item variant="outline">
            <UI.ItemMedia variant="icon">
              <FileText size={16} />
            </UI.ItemMedia>
            <UI.ItemContent>
              <UI.ItemTitle>Example Supplier</UI.ItemTitle>
              <UI.ItemDescription>Request · R$ 1.750,00</UI.ItemDescription>
            </UI.ItemContent>
            <UI.ItemActions>
              <UI.Button
                variant="outline"
                onClick={() => notify('Detail opened')}
              >
                Ver detalhe
              </UI.Button>
            </UI.ItemActions>
          </UI.Item>
        </UI.ItemGroup>
      )
    case 'Table':
    case 'DataTable':
      return table
    case 'ReviewSummary':
      return (
        <UI.Stack gap={16}>
          <UI.ReviewSummary fields={fields} title="Plain" />
          <UI.ReviewSummary
            variant="subtle"
            fields={fields}
            title="Subtle transaction surface"
            actions={
              <UI.HeaderActions primary={action} secondary={secondary} />
            }
          />
        </UI.Stack>
      )
    case 'Timeline':
      return <UI.Timeline events={events} />
    case 'Receipt':
      return (
        <UI.Receipt
          recipient="Example Supplier Ltd."
          amount="R$ 1.750,00"
          reference="EXEMPLO-PIX-001"
          date="13/10/2026, 10:30"
        />
      )
    case 'Alert':
      return (
        <UI.Stack gap={16}>
          <UI.Alert>
            <Info size={16} />
            <UI.AlertTitle>Awaiting confirmation</UI.AlertTitle>
            <UI.AlertDescription>
              The payment has no final outcome yet.
            </UI.AlertDescription>
          </UI.Alert>
          <UI.Alert variant="destructive">
            <UI.AlertTitle>Could not complete</UI.AlertTitle>
            <UI.AlertDescription>
              Check the reason before retrying.
            </UI.AlertDescription>
          </UI.Alert>
        </UI.Stack>
      )
    case 'AlertDialog':
      return (
        <UI.AlertDialog>
          <UI.AlertDialogTrigger asChild>
            <UI.Button variant="outline">Open confirmation</UI.Button>
          </UI.AlertDialogTrigger>
          <UI.AlertDialogContent>
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle>
                Cancel the example request?
              </UI.AlertDialogTitle>
              <UI.AlertDialogDescription>
                This demonstration does not change real payments.
              </UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Back</UI.AlertDialogCancel>
              <UI.AlertDialogAction onClick={() => notify('Example canceled')}>
                Confirm cancellation
              </UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialog>
      )
    case 'Toaster':
      return (
        <UI.Inline gap={8}>
          <UI.Button onClick={() => UI.toast.success('Example saved')}>
            Sucesso
          </UI.Button>
          <UI.Button
            variant="outline"
            onClick={() =>
              UI.toast.error('Could not complete', {
                description: 'Example error; context remains on the page.',
              })
            }
          >
            Erro
          </UI.Button>
          <UI.Button
            variant="outline"
            onClick={() =>
              UI.toast.info('Example update', {
                action: {
                  label: 'Ver detalhe',
                  onClick: () => notify('Example detail'),
                },
              })
            }
          >
            With action
          </UI.Button>
        </UI.Inline>
      )
    case 'Skeleton':
    case 'ContentSkeleton':
      return (
        <UI.ContentSkeleton
          variant="table"
          label="Static skeleton demonstration"
        />
      )
    case 'Spinner':
      return (
        <UI.Stack gap={16}>
          <UI.Inline gap={8}>
            <UI.Spinner />
            <span className="type-ui">Action in progress</span>
          </UI.Inline>
          <LoadingDemo />
        </UI.Stack>
      )
    case 'Avatar':
      return (
        <UI.Inline gap={16}>
          <UI.Avatar name="Nágela Carvalho" />
          <UI.Avatar name="Carlos Almeida" />
        </UI.Inline>
      )
    case 'BrandLoading':
      return (
        <UI.Stack gap={16}>
          <UI.BrandLoading label="Confirming your payment" />
          <p className="type-caption">
            Organic background movement and a subtle logo pulse. No percentage
            or progress indicator. Reduced motion uses the static composition.
          </p>
        </UI.Stack>
      )
    case 'FlowIllustration':
      return (
        <UI.Inline gap={16}>
          {(['setup', 'security', 'waiting', 'processing'] as const).map(
            (kind) => (
              <UI.Stack key={kind} gap={4}>
                <UI.FlowIllustration kind={kind} />
                <span className="type-caption">{kind}</span>
              </UI.Stack>
            ),
          )}
        </UI.Inline>
      )
    case 'FlowState':
      return (
        <UI.Stack gap={16}>
          <UI.FlowState
            kind="waiting"
            title="Waiting for approval"
            description="The request is saved. Carlos needs to review it before authorization."
            owner="Carlos · Company approver"
            next="Authorization after approval"
          />
          <UI.FlowState
            kind="ready"
            title="Ready to authorize"
            description="Company approval has been recorded."
            owner="Authorized representative"
            action={<UI.Button>Authorize payment</UI.Button>}
          />
        </UI.Stack>
      )
    case 'EmptyState':
      return (
        <UI.EmptyState
          title="No payments found"
          description="Try another filter or create a request."
          action={
            <UI.Button
              variant="outline"
              onClick={() => notify('Search cleared')}
            >
              Clear filters
            </UI.Button>
          }
        />
      )
    case 'PaymentStatus':
      return (
        <UI.Inline gap={8}>
          {(
            [
              'Pending approval',
              'Processing',
              'Paid',
              'Failed',
            ] as UI.PaymentState[]
          ).map((state) => (
            <UI.PaymentStatus key={state} state={state} />
          ))}
        </UI.Inline>
      )
    case 'Badge':
      return (
        <UI.Inline gap={8}>
          {(
            [
              'default',
              'secondary',
              'outline',
              'destructive',
              'ghost',
              'link',
            ] as const
          ).map((v) => (
            <UI.Badge variant={v} key={v}>
              {v}
            </UI.Badge>
          ))}
        </UI.Inline>
      )
    case 'EvidenceBadge':
      return (
        <UI.Inline gap={8}>
          <UI.EvidenceBadge kind="Demo" />
          <UI.EvidenceBadge kind="Official" />
          <UI.EvidenceBadge kind="Reconstruction" />
        </UI.Inline>
      )
    case 'Card':
      return (
        <UI.Card>
          <UI.CardHeader>
            <UI.CardTitle>Content group</UI.CardTitle>
            <UI.CardDescription>
              Related title and description.
            </UI.CardDescription>
          </UI.CardHeader>
          <UI.CardContent>
            <p className="type-ui">
              16 px padding; 16 px radius; Slate 100 border and subtle shadow.
            </p>
          </UI.CardContent>
        </UI.Card>
      )
    case 'Separator':
      return (
        <UI.Stack gap={16}>
          <p className="type-ui">Previous group</p>
          <UI.Separator />
          <p className="type-ui">Next group</p>
        </UI.Stack>
      )
    case 'Stack':
    case 'Inline':
      return (
        <UI.Stack gap={16}>
          {UI.designSystem.spacing.map((gap) => (
            <div key={gap}>
              <p className="type-caption">gap={gap}</p>
              {name === 'Stack' ? (
                <UI.Stack gap={gap}>
                  <UI.Badge variant="secondary">Element 1</UI.Badge>
                  <UI.Badge variant="secondary">Element 2</UI.Badge>
                </UI.Stack>
              ) : (
                <UI.Inline gap={gap}>
                  <UI.Badge variant="secondary">Element 1</UI.Badge>
                  <UI.Badge variant="secondary">Element 2</UI.Badge>
                </UI.Inline>
              )}
            </div>
          ))}
        </UI.Stack>
      )
    case 'BrandMark':
      return (
        <span className="brand-symbol">
          <UI.BrandMark />
        </span>
      )
    case 'Dialog':
      return (
        <>
          <UI.Button onClick={() => setDialog(true)}>Open modal</UI.Button>
          <UI.Dialog open={dialog} onOpenChange={setDialog}>
            <UI.DialogContent>
              <UI.DialogHeader>
                <UI.DialogTitle>Review request</UI.DialogTitle>
                <UI.DialogDescription>
                  Escape fecha; foco retorna ao acionador.
                </UI.DialogDescription>
              </UI.DialogHeader>
              <UI.ReviewSummary fields={fields} />
              <UI.Button variant="outline" onClick={() => setDialog(false)}>
                Close
              </UI.Button>
            </UI.DialogContent>
          </UI.Dialog>
        </>
      )
    default:
      return <p className="type-ui">Example available through the API.</p>
  }
}
export default function ComponentCatalog({
  selected,
  onNavigate,
}: {
  selected?: string
  onNavigate: (route: string) => void
}) {
  const entry = UI.designSystem.components.find(
    (c) => componentSlug(c.name) === selected,
  )
  if (!entry)
    return (
      <div className="catalog-groups">
        {UI.designSystem.groups.map((group) => (
          <section key={group.name}>
            <h2 className="type-h2">{group.name}</h2>
            <div className="catalog-grid">
              {group.components.map((name) => {
                const item = UI.designSystem.components.find(
                  (c) => c.name === name,
                )
                return (
                  item && (
                    <UI.Pressable
                      key={name}
                      onClick={() =>
                        onNavigate(`components/${componentSlug(name)}`)
                      }
                    >
                      <strong>{name === 'Toaster' ? 'Sonner' : name}</strong>
                      <span>{item.role}</span>
                    </UI.Pressable>
                  )
                )
              })}
            </div>
          </section>
        ))}
      </div>
    )
  const variants: readonly string[] = entry.variants
  const registryEntry = UI.designSystem.components.find(
    (c) => c.file === entry.file,
  )!
  const doc =
    UI.designSystem.documentation[
      entry.name as keyof typeof UI.designSystem.documentation
    ]
  return (
    <UI.Tabs defaultValue="examples" className="component-documentation">
      <UI.TabsList variant="line">
        <UI.TabsTrigger value="examples">Examples</UI.TabsTrigger>
        <UI.TabsTrigger value="source">Code</UI.TabsTrigger>
        <UI.TabsTrigger value="contract">API and contract</UI.TabsTrigger>
      </UI.TabsList>
      <UI.TabsContent value="examples">
        <UI.Stack gap={16}>
          <section
            className={
              entry.name === 'Button'
                ? 'catalog-preview-unframed'
                : 'catalog-preview'
            }
            aria-label={`Preview de ${entry.name}`}
          >
            <ComponentDemo key={entry.name} name={entry.name} />
          </section>
          {doc && (
            <p className="component-guidance type-body">{doc.guidance}</p>
          )}
        </UI.Stack>
      </UI.TabsContent>
      <UI.TabsContent value="source">
        <UI.Stack gap={16}>
          <section>
            <h2 className="type-h3">Usage example</h2>
            <UI.ScrollArea className="usage-code-scroll">
              <pre>
                <code>{`import { ${entry.name === 'Toaster' ? 'Toaster, toast' : entry.name} } from '@/design-system'\n\n${UI.designSystem.usage[entry.name as keyof typeof UI.designSystem.usage] ?? '// See the props and exports in the implementation below.'}`}</code>
              </pre>
            </UI.ScrollArea>
          </section>
          <section>
            <h2 className="type-h3">Implementation</h2>
            <SourceCode key={entry.name} name={entry.name} />
          </section>
        </UI.Stack>
      </UI.TabsContent>
      <UI.TabsContent value="contract">
        <dl className="contract-meta">
          <div>
            <dt>Papel</dt>
            <dd>{entry.role}</dd>
          </div>
          <div>
            <dt>Registro</dt>
            <dd>
              <code>{componentSlug(registryEntry.name)}</code>
            </dd>
          </div>
          {variants.length > 0 && (
            <div>
              <dt>Variants</dt>
              <dd>{variants.join(' · ')}</dd>
            </div>
          )}
          <div>
            <dt>Disponibilidade</dt>
            <dd>Implemented · fictional example data</dd>
          </div>
        </dl>
        <UI.Inline gap={16}>
          <a
            href={`/r/${componentSlug(registryEntry.name)}.json`}
            target="_blank"
            rel="noreferrer"
          >
            JSON registry ↗
          </a>
          <a href="/api/DS_CONTRACT.md" target="_blank" rel="noreferrer">
            Markdown contract ↗
          </a>
        </UI.Inline>
      </UI.TabsContent>
    </UI.Tabs>
  )
}
