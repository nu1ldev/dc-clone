'use client'

import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function Home() {
  const clerkUser = useUser();
  const user = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/get-user`, {
        method: 'POST',
        body: JSON.stringify({
          clerk_id: clerkUser.user?.id
        })
      })
      if (!req.ok) {
        throw new Error('Failed to fetch user')
      }
      return await req.json()
    },
    enabled: clerkUser.isLoaded
  })
  const friends = useQuery({
    queryKey: ['get-friends'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/get-friends', {
        method: 'POST',
        body: JSON.stringify({ userId: user.data.id })
      })
      return await req.json()
    },
    enabled: !!user.data
  })
  return (
    <div className='w-full h-full flex flex-col gap-y-3 items-center p-6'>
      {!(friends.status == 'success') ? (
        <div>
          bamdwdw
        </div>
      ) : (
        <>
          <div className='w-full rounded bg-black/30 px-3 py-[6px] flex flex-row'>
            <input type="text" className='outline-none bg-transparent w-full' placeholder='Search' />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className='w-full h-[1px] bg-white/20 rounded-full'/>
          <div className='w-full'>
            {friends.data?.map((friend: User) => (
              <Link
                key={friend.id}
                href={`/channels/${friend.id}?pt=dm`}
                className='group flex flex-row gap-x-3 items-center bg-inherit hover:bg-white/5 rounded-lg px-3 py-3 w-full'
              >
                <img
                  className='rounded-full size-10'
                  src={friend.imageUrl!}
                  alt={`${friend.username}'s profile picture`}
                />
                <div className='flex flex-row gap-x-1'>
                  <span className='font-medium'>{friend.displayName}</span>
                  <span className='scale-0 group-hover:scale-100'>{friend.username}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      <div className='flex flex-col gap-y-0 w-10/12'>
        bambambam
        <div>wdnjedw</div>
      </div>
    </div>
  )
}
