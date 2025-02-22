import { db } from '@/db'
import type { Server, Channel } from '@prisma/client'
import { redirect } from 'next/navigation'

const Channelbbb = async ({ params }: { params: Promise<{ id: string }> }) => {
  // id = serverid -> '67b4ccc543cde1c16b35215c': ankaralilar06
  const { id } = await params
  const messages = await db.message.findMany({
    where: {
      id
    },
    orderBy: {
      sentAt: 'asc'
    }
  })
  return (
    <div id='messages'>

    </div>
  )
}

export default Channelbbb
