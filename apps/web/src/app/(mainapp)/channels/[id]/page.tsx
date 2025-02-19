import React from 'react'
import { db } from '@/db'
import type { Channel, Server } from '@prisma/client'

const Channel = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  let channelOrServer: 'server' | 'dm';
  let obj: Channel | Server;
  if (!db.channel.findUniqueOrThrow({ where: { id } })) {
    channelOrServer = 'server'
  } else {
    channelOrServer = 'dm'
  }
  return (
    <div>
      {channelOrServer == 'dm' ? (
        <div>

        </div>
      ) : (
        <div>
          
        </div>
      )}
    </div>
  )
}

export default Channel