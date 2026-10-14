import type { Stage } from './flow-model'
import type { Scenario } from './workspace'

/** Consistent labels and deterministic scenario metadata, shared by the workspace and explorer. */
export const paymentStatusLabels: Record<Stage, string> = {
  idle: 'Ready to start',
  connect: 'Choosing source',
  'bank-connect': 'Connection authorization',
  entry: 'Draft',
  review: 'Ready for review',
  approval: 'Pending company approval',
  authorize: 'Payment authorization required',
  bank: 'Payment confirmation',
  processing: 'Processing',
  funded: 'Top-up confirmed',
  failed: 'Failed',
  unknown: 'Awaiting confirmation',
  paid: 'Paid',
  rejected: 'Rejected',
}
export const scenarioOptions: {
  id: Scenario
  title: string
  hypothesis: string
  observe: string
}[] = [
  {
    id: 'first',
    title: 'First payment · connect a bank',
    hypothesis: 'H1',
    observe:
      'Identify where the funds come from and keep the draft through connection.',
  },
  {
    id: 'ready',
    title: 'Pay from a connected account',
    hypothesis: 'H1 · H4',
    observe:
      'Select the source and check the recipient and amount before submitting.',
  },
  {
    id: 'approval',
    title: 'Company approval pending',
    hypothesis: 'H2',
    observe: 'Recognize who acts next and that approval does not move money.',
  },
  {
    id: 'authorization',
    title: 'Approved · authorize payment',
    hypothesis: 'H2',
    observe:
      'Distinguish the company decision from secure payment confirmation.',
  },
  {
    id: 'rejected',
    title: 'Request rejected · correct it',
    hypothesis: 'H3 · H4',
    observe:
      'Find the reason, correct the saved details and request a new decision.',
  },
  {
    id: 'canceled',
    title: 'Device confirmation canceled',
    hypothesis: 'H3',
    observe:
      'Resume authorization with the existing approval and saved details.',
  },
  {
    id: 'expired',
    title: 'Bank connection expired',
    hypothesis: 'H1 · H3',
    observe: 'Reconnect without losing the payment context.',
  },
  {
    id: 'balance',
    title: 'Insufficient funds',
    hypothesis: 'H3',
    observe: 'Understand the cause and review another source before retrying.',
  },
  {
    id: 'limit',
    title: 'Bank limit exceeded',
    hypothesis: 'H3',
    observe: 'Distinguish a limit problem from insufficient funds.',
  },
  {
    id: 'unavailable',
    title: 'Confirmed service failure',
    hypothesis: 'H3',
    observe: 'Recover after confirmation that no transfer completed.',
  },
  {
    id: 'unknown',
    title: 'Payment result unknown',
    hypothesis: 'H2 · H3',
    observe: 'Check the same request instead of creating a duplicate.',
  },
  {
    id: 'paid',
    title: 'Payment completed',
    hypothesis: 'H2',
    observe: 'Recognize the final result and find its details and history.',
  },
]
export function scenarioCategory(id: Scenario) {
  if (['balance', 'limit', 'unavailable'].includes(id))
    return { label: 'Error', tone: 'status-error' }
  if (id === 'unknown')
    return { label: 'Uncertain outcome', tone: 'status-pending' }
  if (id === 'rejected') return { label: 'Rejection', tone: 'status-error' }
  if (id === 'canceled')
    return { label: 'Interruption', tone: 'status-pending' }
  if (id === 'expired') return { label: 'Recovery', tone: 'status-pending' }
  if (id === 'approval') return { label: 'Waiting', tone: 'status-pending' }
  return { label: 'Happy path', tone: 'status-success' }
}
