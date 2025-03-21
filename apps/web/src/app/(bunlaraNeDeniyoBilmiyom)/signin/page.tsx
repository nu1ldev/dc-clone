'use client'

import toast from 'react-hot-toast'
import { signin, logout } from './actions'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

const Page = () => {
  const [loading, setLoading] = useState(false)
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h1 className='text-5xl font-gintonord font-bold text-center'>Log in to Discord Clone</h1>
      <div className='bg-transparent h-5' />
      <div className='bg-black w-full h-[1px] rounded-full' />
      <form className='flex flex-col gap-y-4'>
        <input
          id='email'
          name='email'
          placeholder='Email'
          className='rounded-lg border-2 p-3 border-white/60 outline-none focus:border-white bg-transparent'
        />
        <input
          id='password'
          name='password'
          placeholder='Password'
          className='rounded-lg border-2 p-3 border-white/60 outline-none focus:border-white bg-transparent'
        />
        <button
          formAction={e => {
            new Promise(async (resolve, reject) => {
              setLoading(true)
              return await signin(e).then(resolve).catch(reject)
            })
              .then(data => {
                console.log(data)
                toast.success('Logged in successfully')
                setTimeout(() => {
                  redirect('/channels?pt=home')
                }, 1500)
              })
              .catch(err => {
                console.log(err)
                toast.error(err.message)
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          className={`text-white rounded-lg p-3 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-midnightGreen-500 hover:bg-midnightGreen-600 transition flex flex-row gap-x-2 items-center justify-center disabled:bg-gray-400`}
          disabled={loading}
        >
          {loading && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='size-6 animate-spin'
              viewBox='0 0 512 512'
            >
              <path d='M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5'></path>
            </svg>
          )}{' '}
          <span className={`${loading && 'opacity-60'}`}>Log In</span>
        </button>
        <button formAction={() => {
          logout().then(data => {
            console.log(data)
          })
        }}>log out</button>
      </form>
      <div className='flex flex-row gap-x-2 w-2/3 h-fit items-center'>
        <div className='h-[1px] bg-white/80 w-3/6' />
        <span>or</span>
        <div className='h-[1px] bg-white/80 w-3/6' />
      </div>
      <div className='flex flex-row gap-x-2 w-2/3 h-fit items-center justify-center'>
        <span>Don't have an account?</span>
        <Link href='/signup' className='text-midnightGreen-100 hover:underline'>
          Create one!
        </Link>
      </div>
    </div>
  )
}

export default Page
