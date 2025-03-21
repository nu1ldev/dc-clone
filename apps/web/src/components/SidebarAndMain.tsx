'use client'

import { useQuery } from '@tanstack/react-query'
import type { Tables } from '@/database.types'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { UserResponse } from '@supabase/supabase-js'
import Image from 'next/image'

const SidebarTopAndMain = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const pageType = searchParams.get('pt')
  const pathName = usePathname()
  const pathId = pathName.replace('/channels', '')

  // console.log('pathId:', pathId)
  // console.log('pageType:', pageType)

  const [userMenu, setUserMenu] = useState<boolean>(false)
  const [user, setUser] = useState<UserResponse | null>(null)
  useEffect(() => {
    supabase.auth.getUser().then(user => {
      setUser(user)
    })
  }, [])

  // queryler
  const channelAndServer = useQuery({
    // server ve o serverın channelları
    queryKey: ['get-channel-and-server'],
    queryFn: async () => {
      // 200 ok çözüldü
      const serverReq = await fetch('http://localhost:9999/get-server', {
        method: 'POST',
        body: JSON.stringify({ serverToken: pathId.split('/')[1] }),
        headers: {
          'Coming-From': 'SidebarAndMain.tsx'
        }
      })
      const server = await serverReq.json() // server: { server: {...}, defaultChannel: {...}, serverChannels: [...] }
      return server
    },
    enabled: pageType === 'server'
  })

  console.log(channelAndServer.data)
  const dm = useQuery({
    queryKey: ['top-get-dms'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/get-dm', {
        method: 'POST',
        body: JSON.stringify({ id: pathId.replace('/', '') }),
        headers: {
          'Coming-From': '/SidebarAndMain.tsx 1'
        }
      })
      return await req.json()
    },
    enabled: pageType === 'dm'
  })

  const dbUser = useQuery({
    // current user
    queryKey: ['get-db-user'],
    queryFn: async () => {
      const userReq = await fetch(
        `http://localhost:9999/db-users/${user?.data.user?.id}`,
        {
          method: 'GET',
          headers: {
            'Coming-From': '/SidebarAndMain.tsx'
          }
        }
      )
      const json = await userReq.json()
      return json.data[0]
    },
    enabled: !!user?.data.user
  })
  const dms = useQuery({
    queryKey: ['user-dms'],
    queryFn: async () => {
      const dmsReq = await fetch('http://localhost:9999/get-dm', {
        method: 'POST',
        body: JSON.stringify({ token: dbUser.data.token }),
        headers: {
          'Coming-From': '/SidebarAndMain.tsx 2'
        }
      })
      return await dmsReq.json()
    },
    enabled: !!dbUser.data
  })
  return (
    <div className='flex flex-col w-full h-full'>
      {/* Top */}
      <div
        id='top'
        className='w-full h-14 bg-gray-700 flex flex-row'
      >
        <div
          id='section-1'
          className='flex flex-row items-center p-3 w-[300px] bg-primary h-full shadow-sm shadow-[#1d1e21] relative'
        >
          {(() => {
            switch (pageType) {
              case null:
                return <div>sıçış</div>
              case 'server':
                return (
                  <>
                    {!channelAndServer.isLoading ? (
                      <div className='flex items-center flex-row gap-x-3 w-full font-semibold'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          className='size-5'
                        >
                          <path
                            fillRule='evenodd'
                            d='M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span>
                          {channelAndServer.data?.server.name}
                        </span>
                      </div>
                    ) : (
                      <div className='flex flex-row gap-x-2 w-full h-full items-center'>
                        <div className='animate-pulse bg-primary w-6 h-6 rounded-full' />
                        <div className='animate-pulse bg-primary w-full h-3 rounded-full' />
                      </div>
                    )}
                  </>
                )
              case 'home':
                return (
                  <div className='w-full rounded bg-black/30 h-full cursor-pointer flex items-center justify-start py-1 px-2 text-white/70 line-clamp-none'>
                    Find or start a conversation
                  </div>
                )
              case 'dm':
                return (
                  <div className='w-full rounded bg-black/30 h-full cursor-pointer flex items-center justify-start py-1 px-2 text-white/70 line-clamp-none'>
                    Find or start a conversation
                  </div>
                )
            }
          })()}
        </div>
        <div
          id='section-2'
          className='flex flex-row items-center gap-x-[6px] p-2 w-full bg-secondary h-full relative shadow-sm shadow-[#1d1e21] font-semibold italic'
        >
          {(() => {
            switch (pageType) {
              case null:
                return <div>sıçış</div>
              case 'home':
                return <div></div>
              case 'server':
                return (
                  <>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      fill='none'
                      aria-hidden='true'
                      className='size-5 text-white/40'
                      viewBox='0 0 24 24'
                    >
                      <path
                        fill='currentColor'
                        fillRule='evenodd'
                        d='M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{channelAndServer.data?.defaultChannel.name}</span>
                  </>
                )
              case 'dm':
                return <div className='bg-red-400 w-full h-full'></div>
            }
          })()}
        </div>
      </div>
      {/* Sidebar and Main */}
      <div className='flex flex-row w-full h-full'>
        {/* Sidebar */}
        <div
          id='sidebar-channels'
          className='bg-[#2b2d31] w-[300px] h-full'
        >
          <div className='w-full h-[94%] bg-inherit'>
            {(() => {
              if (!pageType) {
                return <div id='tum ekran'>sıçış error</div>
              } else if (pageType === 'dm') {
                return (
                  <div className='flex flex-col gap-y-0.5'>
                    {dms.isLoading ? (
                      <div className='animate-pulse px-3 py-2 flex flex-row gap-x-2 bg-[#2b2d31] rounded-lg'></div>
                    ) : (
                      <>
                        {dms.data &&
                          dms.data.map((dm: Tables<'dms'>) => (
                            <Link
                              key={dm.id}
                              href={`/channels/${dm.id}?pt=dm`}
                              className='px-3 py-2 flex flex-row gap-x-2 bg-inherit'
                            >
                              {dm.image_url && <img src={dm.image_url} />}
                            </Link>
                          ))}
                      </>
                    )}
                  </div>
                )
              } else if (pageType === 'server') {
                return (
                  <div className='flex flex-col gap-y-0.5 p-2'>
                    {channelAndServer.data &&
                      channelAndServer.data.serverChannels.map(
                        (channel: Tables<'channels'>) => (
                          <Link
                            key={channel.id}
                            href={`/channels/${channelAndServer.data.server.token}/${channel.id}?pt=server`}
                            id='channel'
                            className='items-center px-3 py-2 flex flex-row gap-x-2 bg-inherit hover:bg-white/10 cursor-pointer rounded-lg'
                          >
                            {(() => {
                              switch (channel.type) {
                                case 'TEXT':
                                  return (
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='24'
                                      height='24'
                                      fill='none'
                                      aria-hidden='true'
                                      className='size-5 text-white/40'
                                      viewBox='0 0 24 24'
                                    >
                                      <path
                                        fill='currentColor'
                                        fillRule='evenodd'
                                        d='M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4z'
                                        clipRule='evenodd'
                                      />
                                    </svg>
                                  )
                                case 'RULES':
                                  return (
                                    <svg
                                      className='size-5 fill-white/40'
                                      xmlns='http://www.w3.org/2000/svg'
                                      viewBox='0 0 512 512'
                                    >
                                      <path d='M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4 106.8 106.7-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4 58.8-58.7-45.3-45.3-58.7 58.7-1.4-1.4z'></path>
                                    </svg>
                                  )
                                case 'ANNOUNCEMENTS':
                                  return (
                                    <svg
                                      className='size-5 fill-white/40'
                                      xmlns='http://www.w3.org/2000/svg'
                                      viewBox='0 0 512 512'
                                    >
                                      <path d='M480 32c0-12.9-7.8-24.6-19.8-29.6S434.5.2 425.3 9.3L381.7 53c-48 48-113.1 75-181 75H64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64v128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352h8.7c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.3c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4zm-64 76.7v262.6C357.2 317.8 280.5 288 200.7 288H192v-96h8.7c79.8 0 156.5-29.8 215.3-83.3'></path>
                                    </svg>
                                  )
                              }
                            })()}
                            <span>{channel.name}</span>
                          </Link>
                        )
                      )}
                  </div>
                )
              }
            })()}
          </div>
          <div className='w-full h-[6%] bg-[#232428] flex items-center p-3 relative flex-row gap-x-2'>
            <div
              className='w-full h-full bg-[#232428] flex items-center p-1 hover:bg-white/40 flex-row gap-x-1 justify-start'
              onClick={() => setUserMenu(prev => !prev)}
            >
              {dbUser.data && (
                <Image
                  className='rounded-3xl'
                  width={36}
                  height={36}
                  src={dbUser.data.image_url}
                  alt={user?.data.user?.user_metadata.username}
                />
              )}
              <div className='flex flex-col justify-center'>
                <span className='text-slate-300'>
                  {user?.data.user?.user_metadata.username}
                </span>
                <span className='text-xs'>tag</span>
              </div>
            </div>
            <div className='p-1 hover:bg-white/40 transition rounded-lg cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
              </svg>
            </div>
          </div>
        </div>
        {/* Main */}
        <div
          id='main'
          className='bg-[#313338] w-full h-full'
        >
          {children}
        </div>
      </div>
    </div>
  )
}
export default SidebarTopAndMain
