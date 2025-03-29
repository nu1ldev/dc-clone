'use client'

import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient()

const HomePage = () => {
  const [userState, setUserState] = useState<{ logged?: boolean, user?: User | null }>({ logged: false, user: null })
  const [scrolled, setScrolled] = useState<boolean>(false)

  // get user's auth status
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        setUserState({ logged: true, user })
      })
      .catch(err => console.log('sıçış user'))
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
      <main
        className={`flex flex-col gap-y-40 -top-16 min-w-full min-h-full ${scrolled ? 'mt-16' : ''}`}
      >
        <div className='p-12 text-4xl'>
          {JSON.stringify(userState, null, 1)}
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
        <div className='h-30 text-9xl'>
          <span>test</span>
        </div>
      </main>
    </div>
  )
}

export default HomePage
