// Accept either an array of jobs or an object { data: Job[]; ... }
type JobsInput<T = any> = T[] | { data?: T[]; [k: string]: any }

function toRowsArray<T>(input: JobsInput<T>): T[] {
  if (Array.isArray(input)) return input
  return input?.data ?? []
}

function escapeCsv(value: unknown): string {
  if (value == null) return ''
  const s = String(value)
  // Quote if contains comma, quote or newline
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function jobsToCSV(input: JobsInput<any>): string {
  const rows = toRowsArray(input)

  const headers = [
    'Title',
    'Company',
    'Status',
    'Location',
    'Applied At',
    'Job Link',
    'Notes',
  ]

  const lines = rows.map((job: any) => {
    const appliedAt =
      job?.appliedAt ? new Date(job.appliedAt).toISOString().slice(0, 10) : ''
    return [
      escapeCsv(job?.title),
      escapeCsv(job?.company),
      escapeCsv(job?.status),
      escapeCsv(job?.location),
      escapeCsv(appliedAt),
      escapeCsv(job?.jobLink),
      escapeCsv(job?.notes),
    ].join(',')
  })

  return [headers.join(','), ...lines].join('\n')
}
