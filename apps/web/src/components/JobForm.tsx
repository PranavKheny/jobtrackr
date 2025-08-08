'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from './Toast'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  status: z.enum(['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']),
  notes: z.string().optional(),
})

export default function JobForm({
  job,
  onJobCreated,
  onJobUpdated,
  onClose,
  isOpen,
}: any) {
  const { addToast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      status: job?.status || 'APPLIED',
      notes: job?.notes || '',
    },
  })

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
        <Input {...register('location')} placeholder="Location" />
        <Select {...register('status')}>
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEWING">Interviewing</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER">Offer</option>
        </Select>
        <textarea
          {...register('notes')}
          placeholder="Notes"
          className="w-full p-2 bg-input rounded-md"
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
