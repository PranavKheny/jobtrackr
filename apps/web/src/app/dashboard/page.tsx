'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getJobs, createJob, updateJob, deleteJob } from '@/lib/api'
import JobItem from '@/components/JobItem'
import JobForm from '@/components/JobForm'
import Analytics from '@/components/Analytics'
import { downloadJobsCSV } from '@/lib/csv'
import { useToast } from '@/components/Toast'
import JobControls from '@/components/JobControls'
import Pagination from '@/components/Pagination'
import { Button } from '@/components/ui/Button'

function DashboardContent() {
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  const [jobs, setJobs] = useState([])
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
        setJobs(data)
        setTotal(total)
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
    const originalJobs = jobs
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
    const originalJobs = jobs
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId))
    try {
      await deleteJob(jobId)
      addToast('Job deleted successfully.', 'success')
    } catch (error) {
      setJobs(originalJobs)
      addToast('Failed to delete job.', 'error')
    }
  }

  const handleDownload = async () => {
    try {
      await downloadJobsCSV()
    } catch (error) {
      console.error('Error downloading CSV:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            <Button
              onClick={handleDownload}
              variant="secondary"
            >
              Download CSV
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              Add New Job
            </Button>
          </div>
        </div>

        <Analytics />
        <JobControls />

        <JobForm
          isOpen={isModalOpen}
          onJobCreated={handleJobCreated}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h2 className="text-2xl font-semibold">No jobs found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or add a new job.
              </p>
            </div>
          ) : (
            jobs.map((job: any) => (
              <JobItem
                key={job.id}
                job={job}
                onJobUpdated={handleJobUpdated}
                onJobDeleted={handleJobDeleted}
              />
            ))
          )}
        </div>
        <Pagination total={total} pageSize={pageSize} page={page} />
      </div>
    </ProtectedRoute>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
