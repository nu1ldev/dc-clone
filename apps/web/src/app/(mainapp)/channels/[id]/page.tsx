import { redirect } from 'next/navigation'
import MainContent from './maincontent'
import { createClient } from '@/utils/supabase/client';

const page = async ({ params }: { params: Promise<{ id: string | number }> }) => {
  const { id } = await params;
  if (typeof id == 'string') {
    console.log('string')
    const supabase = createClient()
    const server = await supabase
      .from('servers')
      .select('*')
      .eq('token', id)
      .limit(1)
      .single();

      if (!server.data) redirect('/channels?pt=home')

    const { data: defaultChannel} = await supabase
      .from('channels')
      .select('*')
      .eq('id', server.data.default_channel_id)
      .limit(1)
      .single();

    redirect(`/channels/${server.data.token}/${defaultChannel?.id}?pt=server`)
  }
  return (
    <MainContent id={String(id)} />
  )
}

export default page
