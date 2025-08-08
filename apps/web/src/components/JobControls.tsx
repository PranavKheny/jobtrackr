'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'

const statusOptions = ['APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED']
const sortOptions = [
  { label: 'Newest', value: 'createdAt,desc' },
  { label: 'Oldest', value: 'createdAt,asc' },
  { label: 'Company', value: 'company,asc' },
]

export default function JobControls() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    const statuses = params.get('status')?.split(',') || []
    if (statuses.includes(status)) {
      params.set('status', statuses.filter((s) => s !== status).join(','))
    } else {
      params.set('status', [...statuses, status].join(','))
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    const [sort, order] = value.split(',')
    params.set('sort', sort)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search jobs..."
        aria-label="Search jobs"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2" role="group" aria-label="Filter by status">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={
                searchParams.get('status')?.includes(status)
                  ? 'default'
                  : 'secondary'
              }
              size="sm"
              onClick={() => handleStatusChange(status)}
              aria-pressed={searchParams.get('status')?.includes(status)}
            >
              {status}
            </Button>
          ))}
        </div>
        <Select
          aria-label="Sort by"
          onChange={(e) => handleSortChange(e.target.value)}
          defaultValue={`${searchParams.get('sort') || 'createdAt'},${
            searchParams.get('order') || 'desc'
          }`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
