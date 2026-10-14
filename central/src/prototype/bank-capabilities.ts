/** Fictional provider responses for the case; never infer support from a bank name in production. */
export type AuthorizationRoute = 'device' | 'bank' | 'unavailable'
export type BankSupport = Readonly<Record<string, AuthorizationRoute>>
export const defaultBankSupport: BankSupport = {
  'Example Bank A': 'device',
  'Example Bank B': 'bank',
}
export function authorizationRoute(
  support: BankSupport,
  bank: string,
): AuthorizationRoute {
  return support[bank] ?? 'unavailable'
}
export const routeDescription: Record<AuthorizationRoute, string> = {
  device: 'Confirm payments on this device',
  bank: 'Confirm each payment at your bank, then return to Clara',
  unavailable: 'Payment initiation is unavailable for this account',
}
