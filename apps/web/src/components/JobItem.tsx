// apps/web/src/components/JobItem.tsx
'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from './ui/Button'
import JobForm from './JobForm'

type Props = {
  job: any
  onJobUpdated: (id: string, data: any) => Promise<void>
  onJobDeleted: (id: string) => Promise<void>
}

export default function JobItem({ job, onJobUpdated, onJobDeleted }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  const applied = job?.appliedAt ? new Date(job.appliedAt) : undefined
  const appliedSafe = applied && !isNaN(applied.getTime()) ? applied : undefined
  const appliedText = appliedSafe ? format(appliedSafe, 'PPP') : '—'

  return (
    <>
      {/* table row (desktop) */}
      <div className="hidden md:table-row">
        <div className="p-4 md:table-cell">
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-muted-foreground">{job.company}</div>
        </div>
        <div className="p-4 md:table-cell">{job.status}</div>
        <div className="p-4 md:table-cell">{appliedText}</div>
        <div className="p-4 text-right md:table-cell">
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onJobDeleted(String(job.id))}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* card (mobile) */}
      <div className="space-y-1 rounded-md border p-4 md:hidden">
        <div className="font-medium">{job.title}</div>
        <div className="text-sm text-muted-foreground">{job.company}</div>
        <p className="text-sm text-muted-foreground">Applied: {appliedText}</p>
        <div className="mt-2 flex gap-2">
          <Button variant="secondary" size="sm" className="w-full" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="w-full" onClick={() => onJobDeleted(String(job.id))}>
            Delete
          </Button>
        </div>
      </div>

      <JobForm
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        job={job}
        onJobUpdated={onJobUpdated}
        onJobCreated={async () => {}}
      />
    </>
  )
}
