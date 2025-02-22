import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { clerk_id } = await req.json();
  if (!clerk_id) return NextResponse.error();
  const user = await db.user.findUnique({
    where: {
      clerk_id
    }
  });
  return NextResponse.json(user, { status: 200 });

}
