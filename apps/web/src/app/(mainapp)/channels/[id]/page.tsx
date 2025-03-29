import { redirect } from 'next/navigation'
import DmContent from './DmContent'
import { createClient } from '@/utils/supabase/client'; // client gerekli

const supabase = createClient()

const page = async ({ params }: { params: Promise<{ id: string | number }> }) => {
  let { id } = await params;
  
  if (Number(id)) {
    id = Number(id)
  }
  
  if (typeof id == 'string') {
    const { data: server } = await supabase
      .from('servers')
      .select('*')
      .eq('token', id)
      .limit(1)
      .single();

      if (!server) redirect('/channels?pt=home')

    const { data: defaultChannel } = await supabase
      .from('channels')
      .select('*')
      .eq('id', server.default_channel_id)
      .limit(1)
      .single();

    if (!defaultChannel) redirect('/channels?pt=home')
    redirect(`/channels/${server.token}/${defaultChannel?.id}?pt=server`)
  }
  return (
    <>
      <DmContent id={String(id)} />
    </>
  )
}

export default page
