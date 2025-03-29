'use client'

import { Tables } from '@/database.types'
import { createClient } from '@/utils/supabase/client'
import { sendMessage } from './actions'
import { useState } from 'react'

const Messageinput = ({
  channel,
  server,
  participants,
  dm,
  user
}: {
  channel?: Tables<'channels'>
  dm?: Tables<'dms'>
  server?: Tables<'servers'>
  participants?: Tables<'users'>[]
  user: Tables<'users'>
}) => {
  const [message, setMessage] = useState<string>('')
  const [embeds, setEmbeds] = useState<File[]>([])

  const supabase = createClient()
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEmbeds([...embeds, e.target.files[0]])
    }
  }

  const handleUpload = async () => {
    if (embeds) {
      console.log('Uploading file...')

      try {
        // You can write the URL of your server or any other endpoint used for file upload
        if (channel && server) {
          embeds.map(async embed => {
            const res = await supabase.storage
              .from('embeds')
              .upload(
                `server_${server.token}/chn_${channel.id}/${embed.name}`,
                embed
              )
            console.log(res)
          })
        } else if (dm) {
          embeds.map(async embed => {
            const res = await supabase.storage
              .from('embeds')
              .upload(`dm_${dm.id}/${embed.name}`, embed)

            console.log(res)
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const getFileType = (mimetype: string) => {
    switch (mimetype) {
      case 'image/png':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM64 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0m152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5S310 448 304 448H80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2.2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z'></path>
          </svg>
        )
      case 'image/jpeg':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM64 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0m152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5S310 448 304 448H80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2.2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z'></path>
          </svg>
        )
      case 'image/jpg':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM64 256a32 32 0 1 1 64 0 32 32 0 1 1-64 0m152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5S310 448 304 448H80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2.2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z'></path>
          </svg>
        )
      case 'application/zip':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM96 48c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8h14.8c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4 0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5.7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16z'></path>
          </svg>
        )
      case 'application/x-rar':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM96 48c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m0 64c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16m-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8h14.8c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4 0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5.7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16z'></path>
          </svg>
        )
      case 'text/plain':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0zm192 0v128h128zM112 256h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16m0 64h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16m0 64h160c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16'></path>
          </svg>
        )
      default:
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='size-20 fill-white/75'
            viewBox='0 0 384 512'
          >
            <path d='M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v288c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64zm384 64H256V0z'></path>
          </svg>
        )
    }
  }
  return (
    <>
      {embeds[0] && (
        <div className='max-w-full p-6 mx-6 h-48 bg-[#1c1e20] rounded-lg flex flex-row gap-x-4'>
          {embeds.map((embed, index) => {
            const splitted = embed.name.split('.')
            const ext = splitted[splitted.length - 1]
            return (
              <div
                key={index}
                className='flex flex-col gap-y-3 p-2 justify-center items-center bg-[#383c40] rounded-lg w-36 h-36'
              >
                {getFileType(embed.type)}
                <div className='flex flex-row gap-x-0'>
                  <span className='max-w-10 line-clamp-1'>{embed.name}</span>
                  <span>.{ext}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div className='flex flex-row items-center rounded-lg my-6 mx-4 p-2 relative gap-x-3 bg-white/10'>
        <label
          htmlFor='files'
          className='flex items-center'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='size-6'
          >
            <path
              fillRule='evenodd'
              d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z'
              clipRule='evenodd'
            />
          </svg>
        </label>
        <input
          id='files'
          onChange={handleFileChange}
          type='file'
          style={{ display: 'none' }}
        />
        <input
          className='bg-transparent outline-none w-full'
          value={message}
          placeholder={
            channel
              ? `Send a message to #${channel.name}`
              : dm
                ? dm.name
                  ? `Send a message to ${dm.name}`
                  : `Send a message to @${participants?.filter(participant => participant.token != user?.token)[0].username}`
                : 'Not found'
          }
          onKeyUp={async e => {
            if (e.key === 'Enter') {
              setMessage('')
              if (channel) {
                const res = await sendMessage({
                  content: message,
                  author_id: user.id,
                  channel_id: channel.id
                })
                console.log(res)
              } else if (dm) {
                const res = await sendMessage({
                  content: message,
                  author_id: user.id,
                  dm_id: dm.id
                })
                console.log(res)
              } else {
                console.log('sıçış')
              }
            }
          }}
          onChange={e => setMessage(e.currentTarget.value)}
          autoFocus
          type='text'
        />
      </div>
    </>
  )
}

export default Messageinput
