'use client'

import toast, { Toaster } from 'react-hot-toast'
import { signin } from './actions'
import { redirect } from 'next/navigation'
import { useState } from 'react'

const page = () => {
  const [loading, setLoading] = useState(false)
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h1 className='text-3xl font-tttrailers'>Log in to Tjorss</h1>
      <div className='bg-black w-full h-[1px] rounded-full' />
      <form className='flex flex-col gap-y-4'>
        <input
          id='email'
          name='email'
          placeholder='email'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <input
          id='password'
          name='password'
          placeholder='password'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <button
          formAction={e => {
            new Promise((resolve, reject) => {
              setLoading(true)
              return signin(e).then(data => data.status && resolve(data)).catch(data => data.error && reject(data.error))
            })
              .then(() => {
                toast.success('Logged in successfully')
                setTimeout(() => {
                  redirect('/channels?pt=home')
                }, 1500)
              })
              .catch(() => {
                toast.error('Failed to log in. Please try again.')
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          className={`text-white rounded-lg p-3 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-500 hover:bg-indigo-600 transition flex flex-row gap-x-2 items-center justify-center disabled:bg-gray-400`}
          disabled={loading}
        >
          Log In
        </button>
      </form>
      <Toaster />
    </div>
  )
}

export default page
