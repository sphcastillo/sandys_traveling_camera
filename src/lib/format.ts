const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const FULL_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatDate(value?: string | null) {
  if (!value) return ''
  return FULL_DATE.format(new Date(`${value}T12:00:00Z`))
}

export function formatMonth(value?: string | null) {
  if (!value) return ''
  return MONTH_YEAR.format(new Date(`${value}T12:00:00Z`))
}

/** "August 2026" for a single month, "August – September 2026" across two. */
export function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return ''
  if (!end) return formatMonth(start)

  const from = formatMonth(start)
  const to = formatMonth(end)
  return from === to ? from : `${from} – ${to}`
}
