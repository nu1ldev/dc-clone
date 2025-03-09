'use client'

import { account, ID, OAuthProvider } from '@/appwrite'
import { useState } from 'react'

const page = () => {
  const signup = async (email: string, password: string, username?: string) => {
    const response = await account.create(
      ID.unique(),
      email,
      password,
      username
    )
    console.log(response)
  }

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [loading, setLoading] = useState<boolean>()
  const [failed, setFailed] = useState<boolean>()
  return (
    <div className='flex flex-col items-center gap-y-3 w-full h-full'>
      <h1 className='text-3xl font-tttrailers'>Sign Up to Tjorss????</h1>
      <div className='bg-black w-[80%] h-[1px] rounded-full' />
      <div className='flex flex-col gap-y-4'>
        <input
          onInput={e => setEmail(e.currentTarget.value)}
          id='input-bambambam-email'
          type='email'
          placeholder='Email'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <input
          onInput={e => setPassword(e.currentTarget.value)}
          id='input-bambambam-password'
          placeholder='Password'
          type='password'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <input
          onInput={e => setUsername(e.currentTarget.value)}
          id='input-bambambam-username'
          placeholder='Username'
          className='rounded-lg border-2 p-3 border-black/60 outline-none focus:border-black'
        />
        <button
          onClick={() => {
            new Promise(async (resolve, reject) => {
              setLoading(true)
              return signup(email, password, username)
                .then(resolve)
                .catch(reject)
            })
              .then(data => {
                console.log(data)
              })
              .catch(err => {
                setFailed(true)
                console.log(err)
              })
              .finally(() => {
                setLoading(false)
              })
          }}
          className={`text-white rounded-lg p-3 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-500 hover:bg-indigo-600 transition flex flex-row gap-x-2 items-center justify-center disabled:bg-gray-400`}
          disabled={loading || !username || !email || !password}
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
        <div className='flex flex-row gap-x-1 items-center'>
          <div className='bg-black w-[80%] h-[1px] rounded-full' />
          <span className='text-black/50'>or</span>
          <div className='bg-black w-[80%] h-[1px] rounded-full' />
        </div>
        <button
          onClick={() => {
            account.createOAuth2Session(OAuthProvider.Google, 'http://localhost:3000/channels?pt=home', 'http://localhost:3000/signup')
          }}
          className='text-white rounded-lg p-3 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-black hover:bg-opacity-80 transition flex flex-row gap-x-2 items-center justify-center disabled:bg-gray-400'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-6'
            preserveAspectRatio='xMidYMid'
            viewBox='-3 0 262 262'
          >
            <path
              fill='#4285F4'
              d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
            ></path>
            <path
              fill='#34A853'
              d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
            ></path>
            <path
              fill='#FBBC05'
              d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z'
            ></path>
            <path
              fill='#EB4335'
              d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
            ></path>
          </svg>
          <span>Sign Up with Google</span>
        </button>
      </div>
    </div>
  )
}

export default page
