'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { deleteJob } from '@/lib/api'
import JobForm from './JobForm'

const statusColors: { [key: string]: string } = {
  APPLIED: 'bg-blue-500',
  INTERVIEWING: 'bg-yellow-500',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

export default function JobItem({ job, onJobUpdated, onJobDeleted }: any) {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(job.id)
      onJobDeleted(job.id)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-card rounded-lg border"
    >
      {isEditing ? (
        <JobForm
          job={job}
          onJobUpdated={(updatedJob: any) => {
            onJobUpdated(updatedJob)
            setIsEditing(false)
          }}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <span
              className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${
                statusColors[job.status]
              }`}
            >
              {job.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <p className="text-sm text-muted-foreground">
            Applied on: {new Date(job.appliedAt).toLocaleDateString()}
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
