'use client'

import { useState } from 'react'
import { createJob, updateJob } from '@/lib/api'
import { motion } from 'framer-motion'

export default function JobForm({
  job,
  onJobCreated,
  onJobUpdated,
  onClose,
}: any) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    status: job?.status || 'APPLIED',
    notes: job?.notes || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (job) {
        const updated = await updateJob(job.id, formData)
        onJobUpdated(updated)
      } else {
        const newJob = await createJob(formData)
        onJobCreated(newJob)
      }
      onClose()
    } catch (error) {
      // Error is handled by optimistic UI in the dashboard
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="bg-card p-8 rounded-lg w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 id="form-title" className="text-2xl font-bold">
            {job ? 'Edit Job' : 'Add New Job'}
          </h2>
          <input
            name="title"
            aria-label="Job Title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            required
            className="w-full p-2 bg-input rounded-md"
          />
          <input
            name="company"
            aria-label="Company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            required
            className="w-full p-2 bg-input rounded-md"
          />
          <input
            name="location"
            aria-label="Location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full p-2 bg-input rounded-md"
          />
          <select
            name="status"
            aria-label="Job Status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 bg-input rounded-md"
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEWING">Interviewing</option>
            <option value="REJECTED">Rejected</option>
            <option value="OFFER">Offer</option>
          </select>
          <textarea
            name="notes"
            aria-label="Notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            className="w-full p-2 bg-input rounded-md"
          />
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : job
                ? 'Update Job'
                : 'Add Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
