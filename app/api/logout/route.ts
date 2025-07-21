// app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).set({
    name: "session",
    value: "",
    path: "/",
    expires: new Date(0),
    httpOnly: true,
  });

  return new Response("Logged out", { status: 200 });
}
