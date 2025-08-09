'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { useToast } from './Toast'
import JobForm from './JobForm'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Modal } from './ui/Modal'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
  APPLIED: 'secondary',
  INTERVIEWING: 'default',
  OFFER: 'secondary', // Should be green, will style later
  REJECTED: 'destructive',
  OTHER: 'outline',
}

export function JobItem({ job, onJobUpdated, onJobDeleted }: any) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <>
      {/* Card view for mobile */}
      <div className="md:hidden p-4 bg-card rounded-lg border space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
          <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Applied: {format(new Date(job.appliedAt), 'PPP')}
        </p>
        <div className="flex gap-2 pt-2">
          <Button onClick={() => setIsEditing(true)} variant="secondary" size="sm" className="w-full">Edit</Button>
          <Button onClick={() => setIsDeleting(true)} variant="destructive" size="sm" className="w-full">Delete</Button>
        </div>
      </div>

      {/* Table row view for desktop */}
      <div className="hidden md:table-row">
        <div className="md:table-cell p-4 align-middle">
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-muted-foreground">{job.company}</div>
        </div>
        <div className="md:table-cell p-4 align-middle">
          <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
        </div>
        <div className="md:table-cell p-4 align-middle">
          {format(new Date(job.appliedAt), 'PPP')}
        </div>
        <div className="md:table-cell p-4 align-middle text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleting(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isEditing && (
        <JobForm
          isOpen={isEditing}
          job={job}
          onJobUpdated={onJobUpdated}
          onClose={() => setIsEditing(false)}
        />
      )}

      <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)} title="Confirm Deletion">
        <p>Are you sure you want to delete this job application? This action cannot be undone.</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="secondary" onClick={() => setIsDeleting(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onJobDeleted(job.id); setIsDeleting(false); }}>Delete</Button>
        </div>
      </Modal>
    </>
  )
}
