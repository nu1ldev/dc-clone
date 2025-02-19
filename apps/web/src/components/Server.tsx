import React from 'react'
import { db } from '@/db'
import Link from 'next/link'

const Server = ({
  name,
  imageUrl,
  id
}: {
  name: string
  imageUrl?: string
  id: string
}) => {
  return (
    <>
      <Link
        href={`/channels/${id}`}
        className='rounded-full hover:rounded-3xl transition-all bg-[#313338] w-12 h-12 flex items-center cursor-pointer'
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
          />
        ) : (
          <>
            <div className='bg-[#2b2d31] w-12 h-12 rounded-full peer hover:rounded-xl hover:bg-indigo-500 transition flex items-center justify-center'>
              <span className='text-white select-none'>{name[0]}</span>
            </div>
            <div id='tooltip' className='scale-0 peer-hover:scale-100 absolute translate-x-14 flex items-center rounded-md bg-gray-800 p-2 shadow-md'>
              <span>{name}</span>
            </div>
          </>
        )}
      </Link>
    </>
  )
}

export default Server
