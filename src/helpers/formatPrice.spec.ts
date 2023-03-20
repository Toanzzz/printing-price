import formatPrice from './formatPrice'

const testCases = [
  { input: 1, expected: '1' },
  { input: 2, expected: '2' },
  { input: 1000, expected: '1,000' },
  { input: 10000000, expected: '10,000,000' },
  { input: 209483759, expected: '209,483,759' },
  { input: NaN, expected: '' },
  { input: null, expected: '' },
  { input: undefined, expected: '' },
]

describe('formatPrice', () => {
  it('should format correctly', () => {
    for (const { input, expected } of testCases)
      expect(formatPrice(input)).toEqual(expected)
  })
})
