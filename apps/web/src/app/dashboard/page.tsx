'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import ProtectedRoute from '@/components/ProtectedRoute'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api'

// ✅ default export, no braces
import JobItem from '@/components/JobItem'
import JobForm from '@/components/JobForm'

// import Analytics from '@/components/Analytics'
import { useToast } from '@/components/Toast'
import JobControls from '@/components/JobControls'
import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

function DashboardContent() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  const [jobs, setJobs] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams(searchParams.toString())
        const { data, total } = await getJobs(params)
        setJobs(data || [])
        setTotal(total || 0)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        addToast('Failed to fetch jobs.', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [searchParams, addToast])

  const handleJobCreated = async (newJobData: any) => {
    // ✅ make optimistic ID a string to match server IDs
    const tempId = `temp-${Date.now()}`
    const newJob = { ...newJobData, id: tempId, isOptimistic: true }
    setJobs((prev) => [newJob, ...prev])
    setIsModalOpen(false)
    try {
      const createdJob = await createJob(newJobData)
      setJobs((prevJobs) => prevJobs.map((j) => (j.id === tempId ? createdJob : j)))
      addToast('Job created successfully.', 'success')
    } catch (error) {
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== tempId))
      addToast('Failed to create job.', 'error')
    }
  }

  // ✅ string IDs (Prisma model uses String/cuid)
  const handleJobUpdated = async (jobId: string, updatedJobData: any) => {
    const original = [...jobs]
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...updatedJobData } : j)))
    try {
      await updateJob(jobId, updatedJobData)
      addToast('Job updated successfully.', 'success')
    } catch {
      setJobs(original)
      addToast('Failed to update job.', 'error')
    }
  }

  const handleJobDeleted = async (jobId: string) => {
    const original = [...jobs]
    setJobs((prev) => prev.filter((j) => j.id !== jobId))
    try {
      await deleteJob(jobId)
      addToast('Job deleted successfully.', 'success')
    } catch {
      setJobs(original)
      addToast('Failed to delete job.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Job Applications</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Job</Button>
      </div>

      {/* <Analytics /> */}
      <JobControls />

      <JobForm
        isOpen={isModalOpen}
        onJobCreated={handleJobCreated}
        onClose={() => setIsModalOpen(false)}
      />

      <Card>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden w-full md:table">
            <div className="md:table-header-group">
              <div className="md:table-row">
                <div className="p-4 font-semibold md:table-cell">Job Title</div>
                <div className="p-4 font-semibold md:table-cell">Status</div>
                <div className="p-4 font-semibold md:table-cell">Applied Date</div>
                <div className="p-4 text-right font-semibold md:table-cell">Actions</div>
              </div>
            </div>
            <div className="md:table-row-group">
              {jobs.map((job) => (
                <JobItem
                  key={job.id}
                  job={job}
                  onJobUpdated={handleJobUpdated}
                  onJobDeleted={handleJobDeleted}
                />
              ))}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {jobs.map((job) => (
              <JobItem
                key={job.id}
                job={job}
                onJobUpdated={handleJobUpdated}
                onJobDeleted={handleJobDeleted}
              />
            ))}
          </div>

          {loading && <p className="p-4 text-center">Loading jobs...</p>}

          {!loading && jobs.length === 0 && (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-semibold">
                {searchParams.toString()
                  ? 'No jobs match your filters'
                  : 'You haven’t added any jobs yet'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {searchParams.toString()
                  ? 'Try adjusting your filters or clearing them.'
                  : 'Get started by adding your first application.'}
              </p>
              {!searchParams.toString() && (
                <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                  Add Job
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Pagination total={total} pageSize={pageSize} page={page} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  )
}
