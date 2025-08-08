'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { deleteJob } from '@/lib/api'
import JobForm from './JobForm'

export default function JobItem({ job, onJobUpdated, onJobDeleted }: any) {
  const [isEditing, setIsEditing] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(job.id)
      onJobDeleted(job.id)
    }
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {isEditing ? (
        <JobForm
          job={job}
          onJobUpdated={(updatedJob) => {
            onJobUpdated(updatedJob)
            setIsEditing(false)
          }}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <div>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.status}</p>
          <p>{new Date(job.appliedAt).toLocaleDateString()}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </motion.div>
  )
}
