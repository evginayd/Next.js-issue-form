import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session"; // Kullanıcı oturumu için
import bcrypt from "bcrypt";
import * as z from "zod";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Giriş formundaki verileri kontrol etmek için şema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password } = loginSchema.parse(body);

//     const user = await db.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const isPasswordCorrect = await compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ✅ Session oluştur
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saatlik oturum
//     const session = await encrypt({ userId: user.id.toString(), expiresAt });

//     // ✅ Cookie olarak set et
//     (
//       await // ✅ Cookie olarak set et
//       cookies()
//     ).set("session", session, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       expires: expiresAt,
//       sameSite: "lax",
//       path: "/",
//     });
//     // Burada JWT token oluşturulabilir ya da session set edilebilir
//     const { password: _, ...userWithoutPassword } = user;
//     return NextResponse.json(
//       { user: userWithoutPassword, message: "Login successful" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: Request) {
  const { username, password } = await request.json();
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await encrypt({
      userId: user.id.toString(),
      expiresAt: new Date(Date.now() + 3600 * 1000),
    });
    console.log("Login user:", {
      id: user.id.toString(),
      username: user.username,
    });
    return NextResponse.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
