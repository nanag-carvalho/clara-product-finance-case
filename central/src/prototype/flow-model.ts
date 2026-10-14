import {
  defaultBankSupport,
  authorizationRoute,
  type BankSupport,
  type AuthorizationRoute,
} from './bank-capabilities.ts'
/** Interaction model for payment details, source preparation and request context. This layer translates design requirements into state transitions without coupling them to JSX. */
import { recognizePix } from './pix-input.ts'
import {
  reducer as paymentReducer,
  initialState as paymentInitialState,
  amountCents,
  demoKey,
  type State as PaymentState,
  type Action as PaymentAction,
} from './model.ts'
export { money, demoKey, amountCents } from './model.ts'
export type { Outcome, MoneyPath, Stage } from './model.ts'
export type State = PaymentState & {
  accounts: string[]
  bankSupport: BankSupport
  description: string
  attachment: string
  recipientDocument: string
  recipientBank: string
  createdAt: string
  rejectionReason: string
  failureReason: 'balance' | 'limit' | 'unavailable'
}
export type Action = (
  | PaymentAction
  | { type: 'BANK_SUPPORT'; bank: string; route: AuthorizationRoute }
  | { type: 'REGISTER_ACCOUNT'; bank: string; at?: string }
  | {
      type: 'CONTEXT'
      field: 'description' | 'attachment'
      value: string
      at?: string
    }
  | { type: 'REJECT'; value: string; at?: string }
  | { type: 'EXPIRE_ACCOUNT'; bank: string; at?: string }
) & { actor?: 'requester' | 'approver'; at?: string }
export const recipientFixtures: Record<string, string> = {
  [demoKey]: 'Example Supplier Ltd.',
  'billing@atlas.test': 'Atlas Supplies',
  'finance@horizonte.test': 'Horizonte Services',
  'pix@nova.test': 'Nova Logistics',
  'pay@aurora.test': 'Aurora Software',
  'billing@delta.test': 'Delta Consulting',
  'pix@solaris.test': 'Solaris Energy',
  'billing@meridian.test': 'Meridian Office',
}
export const demoCreatedAt = '2026-10-14T12:00:00.000Z'
export function initialState(
  preparedOrPath: boolean | 'direct' | 'topup' = 'direct',
  intent = 'DEMO-001',
  createdAt = demoCreatedAt,
): State {
  const prepared = preparedOrPath === true
  return {
    ...paymentInitialState('direct', intent),
    connected: prepared,
    accounts: prepared ? ['Example Bank A'] : [],
    bankSupport: { ...defaultBankSupport },
    description: '',
    attachment: '',
    recipientDocument: '',
    recipientBank: '',
    createdAt,
    rejectionReason: '',
    failureReason: 'balance',
  }
}
export function reducer(s: State, a: Action): State {
  if (a.type === 'BANK_SUPPORT')
    return { ...s, bankSupport: { ...s.bankSupport, [a.bank]: a.route } }
  const route = authorizationRoute(s.bankSupport, s.bank)
  if (
    ['CONNECT', 'CONNECTED', 'REQUEST', 'AUTHORIZE', 'SEND'].includes(a.type) &&
    route === 'unavailable'
  )
    return {
      ...s,
      error:
        'This account cannot initiate this payment. Choose another available account; your details are saved.',
    }
  if (
    a.type === 'REGISTER_ACCOUNT' &&
    authorizationRoute(s.bankSupport, a.bank) === 'unavailable'
  )
    return s

  if ((a.type === 'APPROVE' || a.type === 'REJECT') && a.actor !== 'approver')
    return s
  if (a.type === 'CONTEXT')
    return s.stage === 'entry' ? { ...s, [a.field]: a.value, error: '' } : s
  if (a.type === 'REJECT') {
    if (s.stage !== 'approval') return s
    if (!a.value.trim())
      return {
        ...s,
        error: 'Enter a reason so the requester can correct the payment.',
      }
    return {
      ...s,
      stage: 'rejected',
      approved: false,
      rejectionReason: a.value.trim(),
      error: '',
      events: [
        ...s.events,
        {
          id: 'event-' + (s.events.length + 1),
          title: 'Payment request rejected',
          actor: 'Carlos · company approver',
          dateTime: a.at ?? new Date().toISOString(),
          description: a.value.trim(),
        },
      ],
    }
  }
  if (a.type === 'EDIT' && s.stage === 'rejected')
    return { ...s, stage: 'entry', error: '', notice: '' }
  if (a.type === 'EXPIRE_ACCOUNT') {
    const accounts = s.accounts.filter((bank) => bank !== a.bank)
    return {
      ...s,
      accounts,
      connected: accounts.includes(s.bank),
      notice:
        s.bank === a.bank
          ? 'The bank connection expired. Reconnect before authorization.'
          : s.notice,
    }
  }
  if (a.type === 'REGISTER_ACCOUNT')
    return {
      ...s,
      accounts: [...new Set([...s.accounts, a.bank])],
      connected: s.connected || s.bank === a.bank,
    }
  if (a.type === 'RESET')
    return initialState(
      a.value === 'prepared',
      a.value && a.value !== 'prepared' ? a.value : s.intent,
      a.at,
    )
  if (a.type === 'LOOKUP' && s.stage === 'entry') {
    const input = recognizePix(s.key)
    if (input.error)
      return {
        ...s,
        recipient: '',
        recipientDocument: '',
        recipientBank: '',
        error: input.error,
      }
    const recipient =
      recipientFixtures[input.key] ??
      (input.kind === 'Email' ? '' : 'Example Supplier Ltd.')
    return {
      ...s,
      recipient,
      recipientDocument: recipient ? '••.•••.•••/0001-••' : '',
      recipientBank: recipient ? 'Example Recipient Bank' : '',
      amount: input.amount ?? s.amount,
      error: recipient
        ? ''
        : 'Recipient not found. Check the Pix key and try again.',
    }
  }
  if (a.type === 'FIELD' && a.field === 'key' && s.stage === 'entry')
    return {
      ...s,
      ...paymentReducer(s, a),
      recipientDocument: '',
      recipientBank: '',
    }
  if (
    a.type === 'CANCEL_CONNECTION' &&
    s.stage === 'bank-connect' &&
    a.value === 'refused'
  )
    return {
      ...s,
      stage: 'connect',
      connected: false,
      error:
        'Your bank did not confirm the connection. Try again or select another bank. Your payment details are saved.',
    }
  if (a.type === 'START' && s.stage === 'idle') return { ...s, stage: 'entry' }
  if (a.type === 'REVIEW' && s.stage === 'entry')
    return s.recipient && amountCents(s.amount)
      ? { ...s, stage: 'connect', approved: false, error: '' }
      : { ...s, error: 'Find the recipient and enter a valid amount.' }
  if (a.type === 'BANK' && s.stage === 'connect')
    return {
      ...s,
      bank: a.bank ?? s.bank,
      connected: s.accounts.includes(a.bank ?? s.bank),
      approved: false,
    }
  if (a.type === 'CONNECT' && s.stage === 'connect')
    return { ...s, stage: s.connected ? 'review' : 'bank-connect', error: '' }
  if (a.type === 'CONNECTED' && s.stage === 'bank-connect')
    return {
      ...s,
      stage: 'review',
      approved: false,
      error: '',
      notice: '',
      connected: true,
      accounts: [...new Set([...s.accounts, s.bank])],
    }
  if (a.type === 'EDIT' && s.stage === 'connect')
    return { ...s, stage: 'entry', error: '' }
  if (a.type === 'EDIT' && s.stage === 'review' && a.value === 'source')
    return { ...s, stage: 'connect', approved: false, error: '' }
  if (a.type === 'CANCEL_AUTH' && s.stage === 'bank') {
    const updated = paymentReducer(s, a)
    return {
      ...s,
      ...updated,
      accounts: s.accounts,
      notice:
        route === 'bank'
          ? 'Bank authorization was canceled. Your payment and company approval are saved.'
          : 'Device confirmation was canceled. Your payment and company approval are saved.',
      events: updated.events.map((event, i) =>
        i === updated.events.length - 1
          ? {
              ...event,
              title: 'Payment authorization interrupted',
              description:
                route === 'bank'
                  ? 'Bank authorization canceled before submission.'
                  : 'Device confirmation canceled before submission.',
            }
          : event,
      ),
    }
  }
  if (
    a.type === 'AUTHORIZE' &&
    s.stage === 'authorize' &&
    !s.accounts.includes(s.bank)
  )
    return {
      ...s,
      stage: 'connect',
      approved: false,
      error:
        'Reconnect this bank account, then review and request approval again.',
    }
  if (a.type === 'SEND' && (!s.approved || !s.accounts.includes(s.bank)))
    return s
  if (a.type === 'RETRY' && s.stage === 'failed')
    return { ...s, stage: 'review', approved: false, error: '', notice: '' }
  const result = paymentReducer(s, a)
  if (
    (a.type === 'RESULT' || a.type === 'CHECK') &&
    a.outcome === 'failed' &&
    result !== s &&
    result.stage === 'failed'
  ) {
    const reason = a.reason ?? 'balance'
    return {
      ...s,
      ...result,
      accounts: s.accounts,
      failureReason: reason,
      events: result.events.map((e, i) =>
        i === result.events.length - 1
          ? {
              ...e,
              title:
                reason === 'limit'
                  ? 'Payment declined — bank limit'
                  : reason === 'unavailable'
                    ? 'Payment not completed — service failure'
                    : e.title,
              description:
                'Confirmed no transfer completed. Review before retrying.',
            }
          : e,
      ),
    }
  }
  return {
    ...s,
    ...result,
    accounts: s.accounts,
    failureReason:
      (a.type === 'RESULT' || a.type === 'CHECK') && a.outcome === 'failed'
        ? (a.reason ?? 'balance')
        : s.failureReason,
  }
}
