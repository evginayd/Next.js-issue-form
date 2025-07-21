// lib/auth.ts (server only)
"use server";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// ENV'den gelen secret key
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET not set in .env file");

const key = new TextEncoder().encode(secret);

// JWT oluşturma
export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10s") // veya "30d"
    .sign(key);
}

// JWT çözümleme
export async function decrypt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Oturum oluşturma (login)
export async function login(formData: FormData) {
  const user = { email: formData.get("email"), name: "John" };

  const expires = new Date(Date.now() + 10 * 1000); // 10 saniye örnek
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, {
    httpOnly: true,
    expires,
    path: "/",
  });
}

// Oturumu sonlandırma (logout)
export async function logout() {
  (await cookies()).set("session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}

// lib/auth.ts
export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// Oturumu yenile
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  const parsed = (await decrypt(session)) as { user: unknown; expires: Date };
  const newExpires = new Date(Date.now() + 10 * 1000);
  const refreshed = await encrypt({ ...parsed, expires: newExpires });

  const res = NextResponse.next();
  res.cookies.set("session", refreshed, {
    httpOnly: true,
    expires: newExpires,
    path: "/",
  });

  return res;
}
