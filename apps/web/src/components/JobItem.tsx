'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from './Toast'
import JobForm from './JobForm'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'

const statusColors: { [key: string]: string } = {
  APPLIED: 'bg-blue-500',
  INTERVIEWING: 'bg-yellow-500',
  OFFER: 'bg-green-500',
  REJECTED: 'bg-red-500',
}

export default function JobItem({ job, onJobUpdated, onJobDeleted }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const { addToast } = useToast()

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      onJobDeleted(job.id)
    }
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        {isEditing ? (
          <JobForm
            job={job}
            onJobUpdated={(updatedJob: any) => {
              onJobUpdated(job.id, updatedJob)
              setIsEditing(false)
            }}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{job.title}</CardTitle>
                <span
                  className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${
                    statusColors[job.status]
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Applied on: {new Date(job.appliedAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="secondary"
                  className="w-full"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="w-full"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </motion.div>
  )
}
