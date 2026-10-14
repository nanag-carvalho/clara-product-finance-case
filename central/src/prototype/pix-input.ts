/** Local input recognition; recipient resolution still belongs to the Pix provider. */
export type PixInput = {
  kind: string
  key: string
  error: string
  amount?: string
}
function documentValid(value: string) {
  if (/^(\d)\1+$/.test(value)) return false
  const weights =
    value.length === 11
      ? [
          [10, 9, 8, 7, 6, 5, 4, 3, 2],
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
        ]
      : [
          [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
          [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
        ]
  return weights.every((w, i) => {
    const sum = w.reduce((total, n, j) => total + Number(value[j]) * n, 0)
    const digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return digit === Number(value[value.length - 2 + i])
  })
}
function fields(value: string) {
  const result: Record<string, string> = {}
  for (let i = 0; i < value.length;) {
    const id = value.slice(i, i + 2),
      length = Number(value.slice(i + 2, i + 4))
    if (
      !/^\d{4}$/.test(value.slice(i, i + 4)) ||
      length < 1 ||
      i + 4 + length > value.length ||
      id in result
    )
      throw new Error('Invalid payload')
    result[id] = value.slice(i + 4, i + 4 + length)
    i += 4 + length
  }
  return result
}
export function crc16(value: string) {
  let crc = 0xffff
  for (const byte of new TextEncoder().encode(value)) {
    crc ^= byte << 8
    for (let i = 0; i < 8; i++)
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}
export function recognizePix(raw: string): PixInput {
  const value = raw.trim(),
    digits = value.replace(/\D/g, '')
  const invalid = (error: string): PixInput => ({
    kind: 'Unrecognized',
    key: '',
    error,
  })
  if (!value) return { kind: '', key: '', error: '' }
  if (value.startsWith('000201')) {
    try {
      const data = fields(value)
      if (
        !/6304[\dA-F]{4}$/i.test(value) ||
        crc16(value.slice(0, -4)) !== value.slice(-4).toUpperCase() ||
        data['00'] !== '01' ||
        data['53'] !== '986' ||
        data['58'] !== 'BR'
      )
        return invalid('Invalid Pix code. Check the complete code.')
      const account = Object.entries(data)
        .filter(([id]) => Number(id) >= 26 && Number(id) <= 51)
        .map(([, v]) => fields(v))
        .find((v) => v['00']?.toLowerCase() === 'br.gov.bcb.pix')
      if (!account) return invalid('This QR code is not a Pix payment.')
      if (account['25'])
        return invalid(
          'Dynamic Pix recognized. Charge resolution is outside this simulation; use a static demo code or a key.',
        )
      if (!account['01']) return invalid('The Pix code has no recipient key.')
      if (data['54'] && !/^\d+(\.\d{1,2})?$/.test(data['54']))
        return invalid('Invalid charge amount.')
      return {
        kind: 'Pix Copia e Cola',
        key: account['01'],
        amount: data['54'],
        error: '',
      }
    } catch {
      return invalid('Incomplete or invalid Pix code.')
    }
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return { kind: 'Email', key: value.toLowerCase(), error: '' }
  if (/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(value))
    return { kind: 'Random key', key: value.toLowerCase(), error: '' }
  if (/^[\d+().\s/-]+$/.test(value)) {
    if (digits.length === 14)
      return documentValid(digits)
        ? { kind: 'CNPJ', key: digits, error: '' }
        : invalid('Invalid CNPJ check digits.')
    if (digits.length === 11 && documentValid(digits) && !value.startsWith('+'))
      return {
        kind: /^\d{11}$/.test(value)
          ? 'CPF / phone · confirmed by lookup'
          : 'CPF',
        key: digits,
        error: '',
      }
    if (value.includes('/') || /^\d{3}\.\d{3}\.\d{3}-/.test(value))
      return invalid('Invalid document check digits.')
    const phone =
      digits.startsWith('55') && digits.length === 13 ? digits.slice(2) : digits
    if (phone.length === 11 && /^[1-9]{2}9\d{8}$/.test(phone))
      return { kind: 'Mobile phone', key: '+55' + phone, error: '' }
  }
  return invalid('Enter a valid Pix key or paste the complete Pix code.')
}
const field = (id: string, value: string) =>
  id + String(value.length).padStart(2, '0') + value
const payload =
  field('00', '01') +
  field(
    '26',
    field('00', 'br.gov.bcb.pix') +
      field('01', 'payments@example-supplier.test'),
  ) +
  field('52', '0000') +
  field('53', '986') +
  field('54', '1750.00') +
  field('58', 'BR') +
  field('59', 'EXAMPLE SUPPLIER') +
  field('60', 'SAO PAULO') +
  field('62', field('05', 'DEMO')) +
  '6304'
export const demoPixCode = payload + crc16(payload)
