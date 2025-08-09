// apps/web/src/lib/api.ts
import { supabase } from '@/lib/supabase'

const BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||
    'http://localhost:3001') as string

async function authHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  // Always return a plain Record<string,string>
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function getJobs(params?: URLSearchParams) {
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const headers: Record<string, string> = {
    ...baseHeaders,
    ...(await authHeader()),
  }

  const url = `${BASE}/api/jobs${params ? `?${params.toString()}` : ''}`
  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json() as Promise<{ data: any[]; total: number; page: number; pageSize: number }>
}

export async function createJob(payload: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
  }

  const res = await fetch(`${BASE}/api/jobs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create job')
  const json = await res.json()
  return json.data ?? json
}

export async function updateJob(id: string, payload: any) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(await authHeader()),
  }

  const res = await fetch(`${BASE}/api/jobs/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to update job')
  const json = await res.json()
  return json.data ?? json
}

export async function deleteJob(id: string) {
  const headers: Record<string, string> = {
    ...(await authHeader()),
  }

  const res = await fetch(`${BASE}/api/jobs/${id}`, {
    method: 'DELETE',
    headers,
  })
  if (!res.ok) throw new Error('Failed to delete job')
  return true
}
