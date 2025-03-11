'use client'

import { useQuery } from "@tanstack/react-query"

const HomePage = () => {
  const {data} = useQuery({
    queryKey: ['test-fetch'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/get-server', {
        method: 'POST',
        body: JSON.stringify({ id: '67cf380e00002e280e9a' })
      })
      return await req.json()
    }
  })
  console.log(data)
  return (
    <div className='flex flex-col w-full h-full'>
      <nav className='flex flex-row items-center justify-between'>
        
      </nav>
      <main>
        bambambam
      </main>
    </div>
  )
}

export default HomePage