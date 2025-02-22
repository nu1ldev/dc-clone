import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { id, serverId } = await req.json();
  if (id && !serverId) {
    const channel = await db.channel.findUnique({
      where: {
        id
      }
    });
    return NextResponse.json(channel)
  } else if (serverId && !id) {
    const serverChannels = await db.server.findUnique({
      where: {
        id: serverId
      }
    }).channels()
    return NextResponse.json(serverChannels)
  }
  return NextResponse.error()
}
