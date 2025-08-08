'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { getJobs } from '@/lib/api'
import JobItem from '@/components/JobItem'
import JobForm from '@/components/JobForm'
import Analytics from '@/components/Analytics'

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

  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <Analytics />
        <button onClick={() => setIsModalOpen(true)}>Add New Job</button>

        {isModalOpen && (
          <JobForm
            onJobCreated={handleJobCreated}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found. Add one to get started!</p>
        ) : (
          <div>
            {jobs.map((job: any) => (
              <JobItem
                key={job.id}
                job={job}
                onJobUpdated={handleJobUpdated}
                onJobDeleted={handleJobDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
