import { db } from '@/db'
import { redirect } from 'next/navigation'

const Channelbbb = async ({ params }: { params: Promise<{ id: string }> }) => {
  // id = serverid -> '67b4ccc543cde1c16b35215c': ankaralilar06
  const { id } = await params
  const defaultChannel = await db.server.findUnique({
    where: {
      id
    }
  }).defaultChannel()
  redirect(`/channels/${id}/${defaultChannel?.id}`)
}

export default Channelbbb
