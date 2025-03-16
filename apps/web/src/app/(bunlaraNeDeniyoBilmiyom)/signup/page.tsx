'use client'

import { useState } from 'react'
import { signup } from './actions'

const page = () => {
  const [loading, setLoading] = useState(false)
  return (
    <div className='flex flex-col items-center gap-y-3 w-full h-full'>
      <h1 className='text-3xl font-tttrailers'>Sign Up to Tjorss????</h1>
      <div className='bg-black w-[80%] h-[1px] rounded-full' />
      <form className='flex flex-col gap-y-4'>
        <input
          id='input-bambambam-email'
          type='email'
          placeholder='Email'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <input
          id='input-bambambam-password'
          placeholder='Password'
          type='password'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <input
          id='input-bambambam-username'
          placeholder='Username'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <button
          formAction={e => {
            new Promise(async (resolve, reject) => {
              setLoading(true)
              return await signup(e).then(resolve).catch(reject)
            })
              .then(data => {
                console.log(data)
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          className={`text-white rounded-lg p-3 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-500 hover:bg-indigo-600 transition flex flex-row gap-x-2 items-center justify-center disabled:bg-gray-400`}
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
          <span className={`${loading && 'opacity-60'}`}>Sign Up</span>
        </button>
      </form>
    </div>
  )
}

export default page
