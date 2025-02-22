'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import type { UseUserReturn } from '@clerk/types'
import { useContext } from 'react'
import { CurrentChannelContext } from '@/app/(mainapp)/channels/context'

const SidebarTopAndMain = ({ children }: { children: React.ReactNode }) => {
  const user = useUser()
  return (
    <div className='flex flex-col w-full h-full'>
      <Top />
      <div className='flex flex-row w-full h-full'>
        <ChannelsSidebar user={user}/>
        <Main>
          {children}
        </Main>
      </div>
    </div>
  )
}

const ChannelsSidebar = ({ user }: { user: UseUserReturn }) => {
  const bambambam = useContext(CurrentChannelContext)
  return (
    <div
      id='sidebar-channels'
      className='bg-[#2b2d31] w-[300px] h-full'
    >
      <div className='w-full h-[94%] bg-inherit'>
        {bambambam.type == null ? (
          <div id='tum ekran'>
            sıçış error
          </div>
        ) : (bambambam.type === 'dm' ? (
          <div>
            type = dm
          </div>
        ) : (
          <div>
            type = server
          </div>
        ))}
      </div>
      <div className='w-full h-[6%] bg-[#232428] flex items-center p-3 relative flex-row gap-x-2'>
        <UserButton />
        <div className='flex flex-col gap-y-0'>
          <span className='text-slate-300'>{user.user?.username}</span>
          <span>tag</span>
        </div>
      </div>
    </div>
  )
}

const Top = () => {
  const bambambam = useContext(CurrentChannelContext)
  return (
    <div className='w-full h-14 bg-gray-700 flex flex-row'>
      <div
        id='section-1'
        className='flex flex-row items-center p-3 w-[300px] bg-primary h-full shadow-sm shadow-[#1d1e21] relative'
      >
        <div className='w-full rounded bg-black/30 h-full cursor-pointer flex items-center justify-start py-1 px-2 text-white/70'>
          Find or start a conversation
        </div>
      </div>
      <div
        id='section-2'
        className='flex flex-row items-center p-2 w-full bg-secondary h-full relative shadow-sm shadow-[#1d1e21]'
      >
        s2
      </div>
    </div>
  )
}

const Main = ({ children }: { children: React.ReactNode }) => {
  const bambambam = useContext(CurrentChannelContext)
  return (
    <div
      id='main'
      className='bg-[#313338] w-full h-full'
    >
      {children}
    </div>
  )
}

export default SidebarTopAndMain
