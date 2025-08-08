'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getJobs } from '@/lib/api'
import JobItem from '@/components/JobItem'
import JobForm from '@/components/JobForm'
import Analytics from '@/components/Analytics'
import { downloadJobsCSV } from '@/lib/csv'

export default function DashboardPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobs()
        setJobs(jobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleJobCreated = (newJob: any) => {
    setJobs([newJob, ...jobs])
  }

  const handleJobUpdated = (updatedJob: any) => {
    setJobs(
      jobs.map((job: any) => (job.id === updatedJob.id ? updatedJob : job))
    )
  }

  const handleJobDeleted = (jobId: number) => {
    setJobs(jobs.filter((job: any) => job.id !== jobId))
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
            <button
              onClick={handleDownload}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
            >
              Download CSV
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Add New Job
            </button>
          </div>
        </div>

        <Analytics />

        {isModalOpen && (
          <JobForm
            onJobCreated={handleJobCreated}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <h2 className="text-2xl font-semibold">No jobs yet</h2>
              <p className="text-muted-foreground">
                Add your first job to get started.
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
      </div>
    </ProtectedRoute>
  )
}
