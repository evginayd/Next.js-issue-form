// GET /api/session
import { NextResponse } from "next/server";
import { getSession } from "@/lib/authStore";

export async function GET() {
  const session = await getSession();
  return NextResponse.json(session);
}
