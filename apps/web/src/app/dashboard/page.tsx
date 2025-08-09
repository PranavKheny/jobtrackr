'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api'
import { JobItem } from '@/components/JobItem'
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
    const tempId = Date.now()
    const newJob = { ...newJobData, id: tempId, isOptimistic: true }
    setJobs([newJob, ...jobs])
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

  const handleJobUpdated = async (jobId: number, updatedJobData: any) => {
    const originalJobs = [...jobs]
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, ...updatedJobData } : j))
    )
    try {
      await updateJob(jobId, updatedJobData)
      addToast('Job updated successfully.', 'success')
    } catch (error) {
      setJobs(originalJobs)
      addToast('Failed to update job.', 'error')
    }
  }

  const handleJobDeleted = async (jobId: number) => {
    const originalJobs = [...jobs]
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId))
    try {
      await deleteJob(jobId)
      addToast('Job deleted successfully.', 'success')
    } catch (error) {
      setJobs(originalJobs)
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
          <div className="hidden md:table w-full">
            <div className="md:table-header-group">
              <div className="md:table-row">
                <div className="md:table-cell p-4 font-semibold">Job Title</div>
                <div className="md:table-cell p-4 font-semibold">Status</div>
                <div className="md:table-cell p-4 font-semibold">Applied Date</div>
                <div className="md:table-cell p-4 font-semibold text-right">Actions</div>
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
          <div className="md:hidden space-y-4">
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
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">
                {searchParams.toString() ? 'No jobs match your filters' : 'You haven’t added any jobs yet'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {searchParams.toString() ? 'Try adjusting your filters or clearing them.' : 'Get started by adding your first application.'}
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
