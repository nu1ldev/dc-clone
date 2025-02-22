import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const { id, userId } = await req.json()
  if (!userId && id) {
    const server = await db.server.findUnique({
      where: {
        id
      }
    })
    return NextResponse.json(server)
  } else if (userId && !id) {
    const userServers = await db.user
      .findUnique({
        where: {
          clerk_id: userId
        }
      })
      .servers()
    return NextResponse.json(userServers)
  }
}
