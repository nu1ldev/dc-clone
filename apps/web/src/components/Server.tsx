import React from 'react'
import Link from 'next/link'

const Server = ({
  server
}: {
<<<<<<< HEAD
  server: any,
  defaultChannelId: string
=======
  server: {
    name: string
    imageUrl?: string
    id: string
  }
>>>>>>> parent of 6a61b5c (bişeyler deniyom)
}) => {
  return (
    <Link
      href={`/channels/${server.id}`}
      className='rounded-full hover:rounded-3xl transition-all bg-[#313338] w-12 h-12 flex items-center cursor-pointer'
    >
      {server.imageUrl ? (
        <img
          src={server.imageUrl}
          alt={server.name}
        />
      ) : (
        <>
          <div className='bg-[#2b2d31] w-12 h-12 rounded-full peer hover:rounded-xl hover:bg-indigo-500 transition flex items-center justify-center'>
            <span className='text-white select-none'>{server.name[0]}</span>
          </div>
          <div id='tooltip' className='scale-0 peer-hover:scale-100 absolute translate-x-14 z-10 flex items-center rounded-md bg-gray-800 p-2 shadow-md'>
            <span>{server.name}</span>
          </div>
        </>
      )}
    </Link>
  )
}

export default Server
