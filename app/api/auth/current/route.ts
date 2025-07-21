import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return NextResponse.json(null);

  const payload = await decrypt(session);
  if (!payload) return NextResponse.json(null);

  const user = await prisma.user.findUnique({
    where: { id: parseInt(payload.userId, 10) },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  return NextResponse.json(user);
}
