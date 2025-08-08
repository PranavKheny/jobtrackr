import { createClient } from './supabase'

const supabase = createClient()

const getHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const getJobs = async () => {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/api/jobs`, { headers })
  return res.json()
}

export const createJob = async (job: any) => {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(job),
  })
  return res.json()
}

export const updateJob = async (id: number, job: any) => {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(job),
  })
  return res.json()
}

export const deleteJob = async (id: number) => {
  const headers = await getHeaders()
  await fetch(`${API_URL}/api/jobs/${id}`, {
    method: 'DELETE',
    headers,
  })
}
