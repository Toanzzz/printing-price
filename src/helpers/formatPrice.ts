const shouldAddCommaAt = (i: number, a: string[]) =>
  (a.length - i) % 3 === 1 && i < a.length - 1

export default function formatPrice(n?: number | null) {
  if (!n) return ''
  return n
    .toString()
    .split('')
    .map((v, i, a) => v + (shouldAddCommaAt(i, a) ? ',' : ''))
    .join('')
}
