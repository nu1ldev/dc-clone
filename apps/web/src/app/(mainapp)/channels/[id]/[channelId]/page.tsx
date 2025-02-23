import { db } from "@/db"
import Messageinput from "./messageinput"

const ChannelPage = async ({ params }: { params: Promise<{ channelId: string }> }) => {
  const { channelId } = await params
  const messages = await db.channel.findUnique({
    where: {
      id: channelId
    }
  }).messages()
  const channel = await db.channel.findUnique({
    where: {
      id: channelId
    }
  })
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
      <Messageinput channelName={channel!.name} />
    </div>
  )
}

export default ChannelPage