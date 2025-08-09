// apps/web/src/components/JobForm.tsx
'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { DatePicker } from './ui/DatePicker'

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  status: z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED', 'OTHER']),
  appliedAt: z.date(),
  jobLink: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof jobSchema>

export type JobFormProps = {
  isOpen: boolean
  onClose: () => void
  onJobCreated: (data: FormData) => Promise<void>
  // ✅ optional for create mode
  onJobUpdated?: (id: string, data: FormData) => Promise<void>
  job?: any
}

export default function JobForm({
  isOpen,
  onClose,
  onJobCreated,
  onJobUpdated,
  job,
}: JobFormProps) {
  const [appliedAt, setAppliedAt] = useState<Date | undefined>(
    job?.appliedAt ? new Date(job.appliedAt) : new Date()
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title ?? '',
      company: job?.company ?? '',
      location: job?.location ?? '',
      status: job?.status ?? 'APPLIED',
      appliedAt: job?.appliedAt ? new Date(job.appliedAt) : new Date(),
      jobLink: job?.jobLink ?? '',
      notes: job?.notes ?? '',
    },
  })

  useEffect(() => {
    setValue('appliedAt', appliedAt || new Date())
  }, [appliedAt, setValue])

  const onSubmit = async (data: FormData) => {
    if (job && onJobUpdated) {
      await onJobUpdated(String(job.id), data)
      onClose()
      return
    }
    await onJobCreated(data)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job ? 'Edit Job' : 'Add New Job'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register('title')} placeholder="Job Title" />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <Input {...register('company')} placeholder="Company" />
          {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>}
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
          className="min-h-[100px] w-full rounded-md bg-input p-2"
        />

        <div className="flex gap-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : job ? 'Update Job' : 'Add Job'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
