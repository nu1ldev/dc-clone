'use client'

import { useQuery } from '@tanstack/react-query'
import Server from './Server'
import { Tables } from '@/database.types'
import Link from 'next/link'

const Servers = ({ user }: { user: Tables<'users'> }) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['get-servers'],
    queryFn: async () => {
      const r = await fetch('http://localhost:9999/get-server', {
        method: 'POST',
        headers: {
          'Coming-From': '/SidebarAndMain.tsx',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: user.token
        })
      })
      return await r.json()
    }
  })
  console.log(data)
  return (
    <div
      id='sidebar-servers'
      className='bg-[#1e1f22] w-[100px] p-2 h-full flex flex-col gap-y-4 items-center'
    >
      <Link
        id='home'
        href={'/channels/pt=home'}
        className='rounded-xl bg-[#2b2d31] hover:bg-indigo-500 transition cursor-pointer p-2 w-12 h-12 flex flex-row items-center justify-center group/home'
      >
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
            d='M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z'
          />
        </svg>
        <div
          id='tooltip'
          className='scale-0 group-hover/home:scale-100 absolute z-10 translate-x-24 flex items-center rounded-md bg-gray-800 p-2 shadow-md'
        >
          Direct Messages
        </div>
      </Link>
      <div className='bg-primary h-1 w-10 rounded' />
      <div
        id='servers'
        className='flex flex-col items-center gap-y-3'
      >
        {!isLoading ? (
          data.map(
            (server: Tables<'servers'>) => (
              <Server
                server={server}
                key={server.name}
              />
            )
          )
        ) : (
          <div className='flex flex-col gap-y-4 items-center justify-center'>
            {(() => {
              const loadingServers = []
              for (let index = 0; index < 10; index++) {
                loadingServers.push(
                  <div
                    key={index}
                    className='animate-pulse rounded-full w-12 h-12 bg-[#2b2d31]'
                  />
                )
              }
              return loadingServers
            })()}
          </div>
        )}
      </div>
      <Link
        id='explore'
        href={'/explore'}
        className='rounded-full hover:rounded-xl bg-[#2b2d31] hover:bg-indigo-500 text-white transition duration-100 ease-linear cursor-pointer p-2 w-12 h-12 flex items-center justify-center group/explore group'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 512 512'
          className='fill-current size-6'
        >
          <path d='M464 256a208 208 0 1 0-416 0 208 208 0 1 0 416 0M0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0m306.7 69.1-144.3 55.5c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31l-55.5 144.3c-3.2 8.5-9.9 15.1-18.4 18.4M288 256a32 32 0 1 0-64 0 32 32 0 1 0 64 0'></path>
        </svg>
        <div
          id='tooltip'
          className='scale-0 group-hover/explore:scale-100 absolute z-10 translate-x-[4.5rem] flex items-center rounded-md bg-gray-800 p-2 shadow-md'
        >
          Explore
        </div>
      </Link>
    </div>
  )
}

export default Servers
