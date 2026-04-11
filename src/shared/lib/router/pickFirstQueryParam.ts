/** Первое значение из `route.query.*` (строка или массив). */
export function pickFirstQueryParam(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0] ?? ''
  return ''
}
