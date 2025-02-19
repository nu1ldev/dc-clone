import { db } from "@/db"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
  const { userId } = await req.json()
  const userServers = await db.user.findUnique({
    where: {
      clerk_id: userId
    }
  }).servers()
  return NextResponse.json(userServers)
}