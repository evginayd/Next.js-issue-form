import { SignJWT, jwtVerify } from "jose";

// Session içine ne koyduğunu açıkça tanımla
export interface SessionPayload {
  userId: string;
  expiresAt: Date;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT({
    userId: payload.userId,
    expiresAt: payload.expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}

export async function decrypt(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret);

  return {
    userId: payload.userId as string,
    expiresAt: new Date(payload.expiresAt as string),
  };
}
