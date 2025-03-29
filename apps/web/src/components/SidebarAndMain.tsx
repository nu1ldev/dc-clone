'use client'

import { useQuery } from '@tanstack/react-query'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { useEffect, useState } from 'react'

import type { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { UserResponse } from '@supabase/supabase-js'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Modal from './Modal'

const SidebarTopAndMain = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const pageType = searchParams.get('pt')
  const pathName = usePathname()
  const pathId = pathName.replace('/channels', '')
  const channelPathId = pathId.split('/')[2]

  // const fac = new FastAverageColor()

  // const rgbToHex = (r: number, g: number, b: number) =>
  //   '#' +
  //   [r, g, b]
  //     .map(x => {
  //       const hex = x.toString(16)
  //       return hex.length === 1 ? '0' + hex : hex
  //     })
  //     .join('')

  // console.log('pathId:', pathId)
  // console.log('channelPathId:', channelPathId)
  // console.log('pageType:', pageType)

  switch (pageType) {
    case 'home':
      break
    case 'server':
      break
    case 'dm':
      break
    default:
      redirect('/channels?pt=home')
  }

  const [user, setUser] = useState<UserResponse | null>(null)
  const [userMenu, setUserMenu] = useState<boolean>(false)
  const [settings, setSettings] = useState<boolean>(false)
  const [usernameModal, setUserNameModal] = useState<boolean>(false)
  const [createDmMenu, setCreateDmMenu] = useState<boolean>(false)

  const settingsRef = useDetectClickOutside({
    onTriggered: () => setSettings(false)
  })
  const createDmMenuRef = useDetectClickOutside({
    onTriggered: () => setCreateDmMenu(false)
  })

  useEffect(() => {
    supabase.auth.getUser().then(setUser)
  }, [])

  // queryler
  const server = useQuery({
    // server ve o serverın channelları
    queryKey: ['get-channel-and-server'],
    queryFn: async () => {
      // 200 ok çözüldü
      const serverReq = await fetch(
        `http://localhost:9999/servers/${pathId.split('/')[1]}`,
        {
          method: 'GET',
          headers: {
            'Coming-From': 'SidebarAndMain.tsx'
          }
        }
      )
      const server = await serverReq.json() // server: { server: {...}, defaultChannel: {...}, serverChannels: [...] }
      return server
    },
    enabled: pageType === 'server'
  })

  const dm = useQuery({
    queryKey: ['top-get-dm'],
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
      return json.data
    },
    enabled: !!user?.data.user
  })
  const dms = useQuery({
    queryKey: ['user-dms'],
    queryFn: async () => {
      const r = await fetch('http://localhost:9999/get-dm', {
        method: 'POST',
        body: JSON.stringify({ token: dbUser.data.token }),
        headers: {
          'Coming-From': '/SidebarAndMain.tsx 2'
        }
      })
      return await r.json()
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
          className='flex flex-row items-center p-3 w-[248.417px] bg-primary h-full shadow-sm shadow-[#1d1e21] relative'
        >
          {(() => {
            switch (pageType) {
              case null:
                return <div>sıçış</div>
              case 'server':
                return (
                  <>
                    {!server.isLoading ? (
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
                        <span>{server.data?.server.name}</span>
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
          className='flex flex-row items-center gap-x-[6px] p-2 w-[calc(100%-248.417px)] bg-secondary h-full relative shadow-sm shadow-[#1d1e21] font-semibold'
        >
          {(() => {
            switch (pageType) {
              case null:
                return <div>sıçış</div>
              case 'home':
                return (
                  <div className='flex flex-row items-center gap-x-[6px] p-2 w-full bg-secondary'>
                    {/* Friends Icon */}
                    <div className='flex flex-row items-center gap-x-[6px] w-full h-full'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                        className='text-white/60 size-6'
                        viewBox='0 0 24 24'
                      >
                        <path
                          fill='currentColor'
                          d='M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
                        ></path>
                        <path
                          fill='currentColor'
                          d='M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.7 7.7 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5'
                        ></path>
                      </svg>
                      <span>Friends</span>
                    </div>
                    <div className='h-full w-full bg-red-500' />
                  </div>
                )
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
                    <span>{server.data?.defaultChannel.name}</span>
                  </>
                )
              case 'dm':
                const otherUser =
                  dm.data &&
                  dbUser.data &&
                  dm.data.participants.filter(
                    (p: any) => p.id != dbUser.data.id
                  )[0]
                return (
                  <>
                    {otherUser ? (
                      <div className='w-full h-full flex flex-row gap-x-2 items-center'>
                        <Image
                          className='rounded-3xl size-7'
                          width={24}
                          height={24}
                          src={otherUser.image_url}
                          alt='bambambam'
                        />
                        <span>@{otherUser.username}</span>
                      </div>
                    ) : (
                      <div className='w-full h-full flex flex-row gap-x-2 items-center'>
                        <div
                          className='animate-pulse rounded-full size-6 bg-animation'
                          id='circle'
                        />
                        <div
                          className='animate-pulse bg-animation rounded-full h-3 w-64'
                          id='username'
                        />
                      </div>
                    )}
                  </>
                )
            }
          })()}
        </div>
      </div>
      {/* Sidebar and Main */}
      <div className='flex flex-row w-full h-[calc(100%-56px)]'>
        {/* Sidebar */}
        <div
          id='sidebar-channels'
          className='bg-[#2b2d31] w-[248.417px] max-h-full overflow-x-hidden flex flex-col'
        >
          <div className='w-full h-full bg-inherit overflow-y-scroll no-scrollbar px-2 py-4 flex flex-col gap-y-2 items-start'>
            {(() => {
              if (!pageType) {
                redirect('/channels?pt=home')
              } else if (pageType === 'home' || pageType === 'dm') {
                return (
                  <>
                    <Link href={'/channels?pt=home'} className='py-2 px-3 bg-inherit hover:bg-white/10 rounded-lg flex flex-row gap-x-2 cursor-pointer items-center font-semibold text-white/70 hover:text-white/90 w-full'>
                      <div
                        id='icon'
                        className='font-semibold text-white/70 hover:text-white/90'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          aria-hidden='true'
                          className='text-white/60 size-6'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fill='currentColor'
                            d='M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8'
                          ></path>
                          <path
                            fill='currentColor'
                            d='M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.7 7.7 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5'
                          ></path>
                        </svg>
                      </div>
                      <span>Friends</span>
                    </Link>
                    <div className='py-2 px-3 bg-inherit hover:bg-white/10 rounded-lg flex flex-row gap-x-2 cursor-pointer items-center font-semibold text-white/70 hover:text-white/90 w-full'>
                      <div id='icon'>
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
                            d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                          />
                        </svg>
                      </div>
                      <span>Shop</span>
                    </div>
                    <div className='py-2 px-3 bg-inherit hover:bg-white/10 rounded-lg flex flex-row gap-x-2 cursor-pointer items-center font-semibold text-white/70 hover:text-white/90 w-full'>
                      <div id='icon'>
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
                            d='M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z'
                          />
                        </svg>
                      </div>
                      <span>Message Requests</span>
                    </div>
                    <div className='text-xs font-funnel-display font-medium text-white/60 py-2 px-3 w-full flex flex-row text-nowrap items-center max-h-fit'>
                      <span>DIRECT MESSAGES</span>
                      <div className='w-full' />
                      <button
                        onClick={() => setCreateDmMenu(prev => !prev)}
                        id='plus-icon'
                        className='hover:text-white cursor-pointer peer'
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
                            d='M12 4.5v15m7.5-7.5h-15'
                          />
                        </svg>
                      </button>
                      <div
                        ref={createDmMenuRef}
                        id='Create DM'
                        className={`text-white absolute translate-y-[215px] translate-x-[175px] ${createDmMenu ? 'scale-100' : 'scale-0'} rounded-xl bg-animation py-1 px-2 w-[400px] h-[400px]`}
                      >
                        reis123
                      </div>
                    </div>
                    {dms.isLoading ? (
                      <>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                        <div className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center w-full h-16'>
                          <div className='animate-pulse rounded-full size-9 bg-animation' />
                          <div className='animate-pulse rounded w-40 h-4 bg-animation' />
                        </div>
                      </>
                    ) : (
                      <>
                        {dms.data &&
                          dms.data.map(
                            ({
                              dm,
                              participants
                            }: {
                              dm: Tables<'dms'>
                              participants: Tables<'users'>[]
                            }) => {
                              const otherUser = participants.filter(
                                p => p.id != dbUser.data.id
                              )[0]
                              return (
                                <Link
                                  key={dm.id}
                                  href={`/channels/${dm.id}?pt=dm`}
                                  className='px-3 py-2 flex flex-row gap-x-2 bg-inherit items-center rounded-lg hover:bg-white/10 w-full'
                                >
                                  {dm.image_url ? (
                                    <Image
                                      className='rounded-3xl'
                                      height={36}
                                      width={36}
                                      src={dm.image_url}
                                      alt='bambambam'
                                    />
                                  ) : (
                                    <Image
                                      className='rounded-3xl'
                                      height={36}
                                      width={36}
                                      src={
                                        'https://i.pinimg.com/736x/c0/3b/62/c03b620b8a48bcd374af5103e9356f67.jpg'
                                      }
                                      alt='bambambam'
                                    />
                                  )}
                                  {otherUser.username}
                                </Link>
                              )
                            }
                          )}
                      </>
                    )}
                  </>
                )
              } else if (pageType === 'server') {
                return (
                  <div className='flex flex-col gap-y-0.5 p-2 w-full'>
                    {server.data &&
                      server.data.serverChannels.map(
                        (channel: Tables<'channels'>) => (
                          <Link
                            key={channel.id}
                            href={`/channels/${server.data.server.token}/${channel.id}?pt=server`}
                            id='channel'
                            className='items-center px-3 py-2 flex flex-row gap-x-2 w-full bg-inherit hover:bg-white/10 cursor-pointer rounded-lg'
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
          <div className='w-full h-[64px] bg-[#232428] sticky flex items-center p-3 flex-row gap-x-2'>
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
            <button
              onClick={() => setSettings(prev => !prev)}
              className='p-1 hover:bg-white/40 transition rounded-lg cursor-pointer'
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
                  d='M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5'
                />
              </svg>
            </button>
          </div>
          {dbUser.data && settings && (
            <div
              id='settings'
              ref={settingsRef}
              className={`rounded-xl transition-all bg-transparent h-[550px] w-72 z-50 left-[4.25rem] fixed bottom-14
              ${settings ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                id='dominant-color'
                className={`h-24 w-full bg-amber-400 rounded-t-xl`}
              />
              <div className='flex flex-row gap-x-1 absolute ml-2 -mt-4 items-center'>
                <div className='bg-secondary rounded-full size-[7rem] flex items-center justify-center'>
                  {dbUser.data && (
                    <img
                      src={dbUser.data.image_url}
                      alt='pp'
                      className='rounded-full size-24 absolute'
                    />
                  )}
                </div>
                <span className='font-medium text-lg'>
                  {dbUser.data && dbUser.data.username}
                </span>
                <button onClick={() => setUserNameModal(true)}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                    className='size-5'
                  >
                    <path d='m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z' />
                    <path d='M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z' />
                  </svg>
                </button>
              </div>
              <div className='h-[calc(550px-6rem)] w-full bg-primary rounded-b-xl p-4'>
                <div
                  id='inner'
                  className='rounded-lg w-full h-full bg-secondary'
                ></div>
              </div>
            </div>
          )}
        </div>
        {/* Main */}
        <div
          id='main'
          className='bg-[#313338] w-[calc(100%-248.417px)] max-h-full'
        >
          {children}
        </div>
      </div>
      <div
        className={`${usernameModal ? 'transition scale-100 w-full h-full left-0 top-0 absolute z-[23748927492387423]' : 'scale-0'}`}
      >
        <Modal
          title='Change Username'
          close={() => setUserNameModal(prev => !prev)}
        >
          <input
            type='text'
            className='outline-none rounded-md bg-secondary py-2 px-4'
            placeholder='New Username'
          />
          <div className='flex flex-row w-full h-fit'>
            <div className='w-full' />
            <button
              onClick={() => {
                'BAMBAMBAM'
              }}
              className='bg-midnightGreen-500 hover:bg-midnightGreen-600 px-3 py-2 rounded-md text-nowrap'
            >
              Change Username
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default SidebarTopAndMain
