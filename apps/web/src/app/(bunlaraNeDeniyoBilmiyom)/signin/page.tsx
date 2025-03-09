'use client'

import { account, ID } from '@/appwrite'
import { useState } from 'react'

const page = () => {
  const login = async (
    email: string,
    password: string,
    username?: string
  ) => {
    const response = await account.createEmailPasswordSession(email, password)
    console.log(response)
  }

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  return (
    <div className='flex flex-col items-center gap-y-2'>
      <h1 className='text-3xl font-tttrailers'>Log in to Tjorss</h1>
      <div className='bg-black w-full h-[1px] rounded-full' />
      <div className='flex flex-col gap-y-4'>
        <div className='flex flex-col gap-y-4 group'>
          <input
            onInput={e => setEmail(e.currentTarget.value)}
            id='input-bambambam'
            placeholder='email'
            className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
          />
        </div>
        <div className='flex flex-col gap-y-4 group'>
          <input
            onInput={e => setPassword(e.currentTarget.value)}
            id='input-bambambam'
            placeholder='password'
            className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
          />
        </div>
        <button onClick={() => login(email, password)} className='text-white rounded-lg p-3 bg-indigo-500 hover:bg-indigo-600 transition'>Log In</button>
      </div>
    </div>
  )
}

export default page
