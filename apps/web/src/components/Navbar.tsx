'use client'

import { createClient } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const supabase = createClient()
  const [authState, setAuthState] = useState<{
    logged?: boolean
    user?: User | null
  }>({ logged: false, user: null })
  const [scrolled, setScrolled] = useState<boolean>(false)

  // get user's auth status
  useEffect(() => {
    supabase.auth.getUser()
      .then(({ data: { user } }) => {
        setAuthState({ user: user, logged: true })
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
    <nav
      className={`flex flex-row items-center justify-between min-h-16 h-16 w-full bg-inherit backdrop-blur-[10px] gap-y-5 top-0 left-0 p-6 ${scrolled ? 'fixed' : 'sticky'}`}
    >
      <Link href='/' className='select-none font-gintonord font-bold text-2xl'>
        Discord Clone
      </Link>
      <div
        id='account-controls'
        className='flex flex-row gap-x-5'
      >
        {authState.logged ? (
          <Link
            href={`/channels?pt=home`}
            id='logged-in'
            className=' px-4 py-3 bg-midnightGreen-500 hover:bg-midnightGreen-600 rounded-2xl transition text-white'
          >
            Go to channels
          </Link>
        ) : (
          <Link
            href={'/signin'}
            id='not-logged-in'
            className='px-4 py-3 bg-midnightGreen-500 hover:bg-midnightGreen-600 rounded-2xl transition text-white'
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
