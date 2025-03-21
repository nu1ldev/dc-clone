import { createClient } from "@/utils/supabase/client"
import Messageinput from "./[channelId]/messageinput"

const ChannelPage = async ({ id }: { id: string }) => {
  const supabase = createClient()
  const messages = await supabase
    .from('messages')
    .select('*')
    .eq('dm_id', Number(id));

  const dm = await supabase
    .from('dms')
    .select('*')
    .eq('id', Number(id))
    .limit(1)
    .single();

  const dmUsers = await supabase
    .from('_user_dms')
    .select('*')
    .eq('dm_id', Number(id));
  return (
    <div className='flex flex-col gap-y-0 justify-end w-full h-full'>
      <div id="messages" className='flex flex-col gap-y-0 justify-end w-full h-full'>
        {messages.data!.map(async message => {
          const author = await supabase
            .from('users')
            .select('*')
            .eq('id', message.author_id)
            .limit(1)
            .single();
          return (
            <div className='bg-inherit w-full h-fit flex flex-row gap-x-3 p-2 hover:bg-primary'>
              <img src={author.data?.image_url} alt={author.data?.username ?? 'bambambam'} className='rounded-full cursor-pointer h-10 w-10' />
              <div className='flex flex-col gap-y-1 justify-center'>
                <div className='flex flex-row gap-x-1 items-center'>
                  <span className='hover:underline cursor-pointer'>{author.data?.username}</span>
                  <span className='text-xs text-white/50'>{message.sent_at}</span>
                </div>
                <div>{message.content}</div>
              </div>
            </div>
          )
        })}
      </div>
      <Messageinput channelName={'test'} />
    </div>
  )
}

export default ChannelPage