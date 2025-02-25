'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className='w-full h-full items-center justify-center flex flex-col gap-y-1'>
      <h2>Something went wrong!</h2>
      <button className='p-2 rounded-lg bg-indigo-500 select-none' onClick={() => reset()}>
        Try again
      </button>
    </div>
  )
}
