'use client'

import { useState } from 'react'
import { createJob, updateJob } from '@/lib/api'

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

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (job) {
      const updated = await updateJob(job.id, formData)
      onJobUpdated(updated)
    } else {
      const newJob = await createJob(formData)
      onJobCreated(newJob)
    }
    onClose()
  }

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <input
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          required
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER">Offer</option>
        </select>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
        />
        <button type="submit">{job ? 'Update Job' : 'Add Job'}</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  )
}
