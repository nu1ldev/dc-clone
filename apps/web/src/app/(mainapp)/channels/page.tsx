'use client'

import { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { UserResponse } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const supabase = createClient()

  const [user, setUser] = useState<UserResponse | null>(null)
  useEffect(() => {
    supabase.auth.getUser().then(user => setUser(user))
  }, [])

  useEffect(() => {}, [])

  // const dbUser = useQuery({
  //   queryKey: ['channels'],
  //   queryFn: async () => {
  //     const req = await fetch(`http://localhost:9999/db-users/${user?.data.user?.id}`)
  //     if (!req.ok) {
  //       throw new Error('Failed to fetch user')
  //     }
  //     return await req.json()
  //   },
  //   enabled: !!user?.data
  // })

  const friends = useQuery({
    queryKey: ['get-friends'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/user-friends', {
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
        <div>bamdwdw</div>
      ) : (
        <>
          <div className='w-full rounded bg-black/30 px-3 py-[6px] flex flex-row'>
            <input
              type='text'
              className='outline-none bg-transparent w-full'
              placeholder='Search'
            />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
              />
            </svg>
          </div>
          <div className='w-full h-[1px] bg-white/20 rounded-full' />
          <div className='w-full'>
            {friends.data?.map((friend: Tables<'users'>) => (
              <Link
                key={friend.id}
                href={`/channels/${friend.id}?pt=dm`}
                className='group flex flex-row gap-x-3 items-center bg-inherit hover:bg-white/5 rounded-lg px-3 py-3 w-full'
              >
                <Image
                  width={40}
                  height={40}
                  className='rounded-full'
                  src={friend.image_url}
                  alt={`${friend.username}'s profile picture`}
                />
                <span className='font-medium'>{friend.username}</span>
                <div className='w-full' />
                <button className='min-h-8 min-w-8 bg-primary scale-0 group-hover:scale-100 rounded-3xl items-center justify-center flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-5 transition fill-white/50 hover:fill-white/60 peer/msg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <button className='min-h-8 min-w-8 bg-primary scale-0 group-hover:scale-100 rounded-3xl items-center justify-center flex'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-5 transition duration-100 text-white/50 hover:text-white/60 peer/link'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                    />
                  </svg>
                  <div className=''>

                  </div>
                </button>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
