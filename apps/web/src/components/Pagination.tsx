'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({ total, pageSize, page }: any) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const totalPages = Math.ceil(total / pageSize)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    replace(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-md bg-secondary disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-md bg-secondary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
