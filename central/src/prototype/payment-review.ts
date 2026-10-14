import { authorizationRoute } from './bank-capabilities'
import type { ReviewField } from '@/design-system'
import { money, type State } from './flow-model'
import { recognizePix } from './pix-input'
export type PaymentReviewFields = {
  payment: ReviewField[]
  context: ReviewField[]
}
/** Explicit groups preserve review hierarchy when fields are added or reordered. */
export function getPaymentReviewFields(
  state: Readonly<State>,
): PaymentReviewFields {
  const pixInput = recognizePix(state.key)
  const payment = [
    {
      label: 'Recipient',
      value: state.recipient || 'Not yet identified',
      emphasis: true,
    },
    {
      label: 'Recipient document',
      value: state.recipientDocument || 'Not yet identified',
    },
    {
      label: 'Receiving institution',
      value: state.recipientBank || 'Not yet identified',
    },
    {
      label:
        pixInput.kind === 'Pix Copia e Cola'
          ? 'Pix code recipient key'
          : 'Pix key',
      value: pixInput.key || state.key,
      stackOnMobile: true,
    },
    { label: 'Amount', value: money(state.amount), emphasis: true },
    {
      label: 'Funding account',
      value: `${state.bank} · •• ${state.bank.endsWith('A') ? '4321' : '8765'}`,
    },
    {
      label: 'Payment confirmation',
      value:
        authorizationRoute(state.bankSupport, state.bank) === 'unavailable'
          ? 'Unavailable for this account'
          : authorizationRoute(state.bankSupport, state.bank) === 'bank'
            ? 'At ' + state.bank
            : 'On the linked device',
    },
    {
      label: 'Money path',
      value:
        state.path === 'direct' ? 'Bank → supplier' : 'Bank → Clara → supplier',
    },
  ]
  const context = [
    { label: 'Description', value: state.description || 'Not provided' },
    {
      label: 'Supporting document',
      value: state.attachment || 'None attached',
    },
    {
      label: 'Created',
      value: new Date(state.createdAt).toLocaleString('en-GB'),
    },
  ]
  return { payment, context }
}
