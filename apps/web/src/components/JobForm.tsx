'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { DatePicker } from './ui/DatePicker'
import { useState } from 'react'

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  status: z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'OTHER']),
  appliedAt: z.date(),
  jobLink: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

export default function JobForm({
  job,
  onJobCreated,
  onJobUpdated,
  onClose,
  isOpen,
}: any) {
  const [appliedAt, setAppliedAt] = useState<Date | undefined>(
    job ? new Date(job.appliedAt) : new Date()
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      status: job?.status || 'APPLIED',
      appliedAt: job ? new Date(job.appliedAt) : new Date(),
      jobLink: job?.jobLink || '',
      notes: job?.notes || '',
    },
  })

  React.useEffect(() => {
    setValue('appliedAt', appliedAt || new Date())
  }, [appliedAt, setValue])

  const onSubmit = async (data: any) => {
    try {
      if (job) {
        await onJobUpdated(job.id, data)
      } else {
        await onJobCreated(data)
      }
      onClose()
    } catch (error) {
      // Error is handled by optimistic UI in the dashboard
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job ? 'Edit Job' : 'Add New Job'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register('title')} placeholder="Job Title" />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message as string}</p>
          )}
        </div>
        <div>
          <Input {...register('company')} placeholder="Company" />
          {errors.company && (
            <p className="text-sm text-red-500 mt-1">{errors.company.message as string}</p>
          )}
        </div>
        <Input {...register('location')} placeholder="Location (e.g., San Francisco, CA)" />
        <Input {...register('jobLink')} placeholder="Link to Job Posting" />
        <DatePicker date={appliedAt} setDate={setAppliedAt} />
        <Select {...register('status')}>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="OTHER">Other</option>
        </Select>
        <textarea
          {...register('notes')}
          placeholder="Notes"
          className="w-full p-2 bg-input rounded-md min-h-[100px]"
        />
        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Add Job'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
