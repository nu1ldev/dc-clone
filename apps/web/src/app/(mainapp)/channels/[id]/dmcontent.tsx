'use client'

import { createClient } from '@/utils/supabase/client'
import { Tables } from '@/database.types'
import { useQuery } from '@tanstack/react-query'
import Messageinput from './[channelId]/messageinput'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const ChannelPage = ({ id }: { id: string }) => {
  const supabase = createClient()
  const [user, setUser] = useState<any>()
  const [newMessages, setNewMessages] = useState<
    { message: Tables<'messages'>; author: Tables<'users'> }[]
  >([])

  useEffect(() => {
    new Promise(async (resolve, reject) => {
      const authUser = await supabase.auth.getUser()

      if (authUser.error) {
        reject(authUser.error)
      }

      const dbUser = await (
        await fetch(`http://localhost:9999/db-users/${authUser.data.user?.id}`)
      ).json()

      if (!dbUser) {
        reject('dbuser sıçış')
      }

      resolve(dbUser.data)
    }).then(setUser)
  }, [])

  useEffect(() => {
    const messagesChannel = supabase.channel(`dm-realtime-channel-${id}`)
    messagesChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        async payload => {
          // @ts-ignore
          const author = await (await fetch(`http://localhost:9999/users/${payload.new.author_id}`)).json()

          setNewMessages(
            // @ts-ignore
            prev => [
              ...prev,
              {
                author,
                message: payload.new
              }
            ]
          )
        }
      )
      .subscribe()

    return () => {
      messagesChannel.unsubscribe()
    }
  }, [])

  const dm = useQuery({
    queryKey: ['get-dm'],
    queryFn: async () => {
      const req = await fetch('http://localhost:9999/get-dm', {
        method: 'POST',
        body: JSON.stringify({
          id
        })
      })
      return await req.json()
    }
  })

  const dbUser = useQuery({
    queryKey: ['get-db-user'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/db-users/${user!.id}`)
      return await req.json()
    }
  })

  const messages = useQuery({
    queryKey: ['get-messages'],
    queryFn: async () => {
      const req = await fetch(`http://localhost:9999/get-messages`, {
        method: 'POST',
        body: JSON.stringify({
          dmId: id
        })
      })
      return await req.json()
    }
  })

  return (
    <div className='flex flex-col gap-y-0 justify-end max-w-full w-full max-h-full h-full'>
      <div
        id='messages'
        className='flex flex-col gap-y-0 justify-end w-full h-full overflow-y-scroll no-scrollbar'
      >
        {!messages.error &&
          !messages.isLoading &&
          messages.data.map(
            ({ message, author }: { message: Tables<'messages'>; author: Tables<'users'> }, i: number) => (
              <div
                key={i}
                className='bg-inherit w-full h-fit flex flex-row gap-x-3 p-2 hover:bg-primary'
              >
                <Image
                  width={40}
                  height={40}
                  src={author.image_url}
                  alt={author.username ?? 'bambambam'}
                  className='rounded-full cursor-pointer size-10'
                />
                <div className='flex flex-col gap-y-1 justify-center'>
                  <div className='flex flex-row gap-x-1 items-center'>
                    <span className='hover:underline cursor-pointer'>
                      {author.username}
                    </span>
                    <span className='text-xs text-white/50'>
                      {message.sent_at}
                    </span>
                  </div>
                  <div>{message.content}</div>
                </div>
              </div>
            )
          )}
        {newMessages.map(
          ({ message, author }, i) => (
            <div
              key={i}
              className='bg-inherit w-full h-fit flex flex-row gap-x-3 p-2 hover:bg-primary'
            >
              <Image
                width={40}
                height={40}
                src={author.image_url ?? 'https://i.pinimg.com/736x/c0/3b/62/c03b620b8a48bcd374af5103e9356f67.jpg'}
                alt={author.username ?? 'bambambam'}
                className='rounded-full cursor-pointer size-10'
              />
              <div className='flex flex-col gap-y-1 justify-center'>
                <div className='flex flex-row gap-x-1 items-center'>
                  <span className='hover:underline cursor-pointer'>
                    {author.username}
                  </span>
                  <span className='text-xs text-white/50'>
                    {message.sent_at}
                  </span>
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          )
        )}
      </div>
      {dm.data && dbUser.data && (
        <Messageinput
          dm={dm.data.dm}
          participants={dm.data.participants}
          user={dbUser.data}
        />
      )}
    </div>
  )
}

export default ChannelPage
