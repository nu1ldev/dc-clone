import { db } from '../../../../appwrite'
import { redirect } from 'next/navigation'
import Messageinput from './[channelId]/messageinput'

const Channelbbb = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params // server da olabilir dm de
  const defaultChannel = await db.server.findUnique({
    where: {
      id
    }
  }).defaultChannel()
  const dm = await db.dm.findUnique({
    where: {
      id
    }
  })
  if (defaultChannel != null && defaultChannel.id && !dm) {
    redirect(`/channels/${defaultChannel.serverId}/${defaultChannel.id}`)
  }
  else if (!defaultChannel && dm != null && dm.id) {
    const messages = await db.message.findMany({
      where: {
        dmId: dm.id
      },
      take: 40
    })
    let dmName;
    let dmImage;
    if (dm.userIds.length === 2) {
      const otherUserId = dm.userIds.filter((val, i, array) => {
        val != dm.id
      })[0]
      const otherUser = await db.user.findUnique({
        where: {
          id: otherUserId
        }
      })
      dmName = otherUser?.username
      if (!dm.imageUrl) dmImage = otherUser?.imageUrl
    }
    return (
      <div className='flex flex-col gap-y-0 justify-end w-full h-full'>
      <div id="messages" className='flex flex-col gap-y-0 justify-end w-full h-full'>
        {messages?.map(async message => {
          const author = await db.user.findUnique({
            where: {
              id: message.authorId
            }
          })
          return (
            <div className='bg-inherit w-full h-fit flex flex-row gap-x-3 p-2 hover:bg-primary'>
              <img src={author!.imageUrl!} alt={author?.username} className='rounded-full cursor-pointer h-10 w-10' />
              <div className='flex flex-col gap-y-1 justify-center'>
                <div className='flex flex-row gap-x-1 items-center'>
                  <span className='hover:underline cursor-pointer'>{author?.username}</span>
                  <span className='text-xs text-white/50'>{message.sentAt.toUTCString()}</span>
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          )
        })}
      </div>
      <Messageinput channelName={dm.name ?? dmName!} />
    </div>
    )
  }
}

export default Channelbbb
