'use client'

import { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { UserResponse } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const supabase = createClient()
  
  const [user, setUser] = useState<UserResponse | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(user => setUser(user))
  }, [])

  const dbUser = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/users/${user?.data.user?.id}`)
      if (!req.ok) {
        throw new Error('Failed to fetch user')
      }
      return await req.json()
    },
    enabled: !!user?.data
  })
  const friends = useQuery({
    queryKey: ['get-friends'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/get-friends', {
        method: 'POST',
        body: JSON.stringify({ token: user?.data.user?.id }),
        headers: {
          'Coming-From': '/channels/page.tsx'
        }
      })
      return await req.json()
    },
    enabled: !!user?.data
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
            {friends.data?.map((friend: Tables<'users'>) => (
              <Link
                key={friend.id}
                href={`/channels/${friend.id}?pt=dm`}
                className='group flex flex-row gap-x-3 items-center bg-inherit hover:bg-white/5 rounded-lg px-3 py-3 w-full'
              >
                <img
                  className='rounded-full size-10'
                  src={friend.image_url}
                  alt={`${friend.username}'s profile picture`}
                />
                <div className='flex flex-row gap-x-1'>
                  <span className='font-medium'>{friend.display_name}</span>
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
