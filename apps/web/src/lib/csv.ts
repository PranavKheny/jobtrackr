import Papa from 'papaparse'
import { getJobs } from './api'

export const downloadJobsCSV = async () => {
  const jobs = await getJobs()

  const data = jobs.map((job: any) => ({
    Title: job.title,
    Company: job.company,
    Location: job.location,
    Status: job.status,
    'Applied Date': new Date(job.appliedAt).toLocaleDateString(),
    Notes: job.notes,
  }))

  const csv = Papa.unparse(data)

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'jobs.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
