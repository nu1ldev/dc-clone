'use client'

import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Card = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-white/5 backdrop-blur-[2px] rounded-md shadow-md p-4 ${className}`}
    >
      {children}
    </div>
  )
}

const HomePage = () => {
  const supabase = createClient()
  const [authState, setAuthState] = useState<{ logged?: boolean, user?: User | null, session?: Session | null }>({ logged: false, user: null, session: null })
  const [scrolled, setScrolled] = useState<boolean>(false)

  // get user's auth status
  useEffect(() => {
    supabase.auth.getUser()
      .then(user => {
        setAuthState({ user: user.data.user, logged: true })
      })

    supabase.auth.getSession()
      .then(session => {
        setAuthState({ session: session.data.session, logged: true })
      })
  }, [])

  // handle scroll event
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 1) {
        // user is at the top of the page
        setScrolled(false)
      } else {
        // user has scrolled down
        setScrolled(true)
      }
    })
  }, [])
  return (
    <div className='flex flex-col w-full h-full'>
      <Navbar />
      <main className={`flex flex-col gap-y-40 -top-16 min-w-full min-h-full ${scrolled ? 'mt-16' : ''}`}>
        <div className='p-12 text-4xl'>{JSON.stringify(authState, null, 1)}</div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
      </main>
    </div>
  )
}

export default HomePage
