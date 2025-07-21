import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session"; // Kullanıcı oturumu için

import * as z from "zod";

// Giriş formundaki verileri kontrol etmek için şema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Session oluştur
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saatlik oturum
    const session = await encrypt({ userId: user.id.toString(), expiresAt });

    // ✅ Cookie olarak set et
    (
      await // ✅ Cookie olarak set et
      cookies()
    ).set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
      path: "/",
    });
    // Burada JWT token oluşturulabilir ya da session set edilebilir
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword, message: "Login successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
