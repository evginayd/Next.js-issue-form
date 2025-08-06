import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";

// Kullanıcı şeması
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(25, "Username must be at most 25 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
  isAdmin: z.boolean().optional(),
});

// GET: Tüm kullanıcıları getir
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
      },
    });
    console.log("Fetched users:", users);
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", details: String(error) },
      { status: 500 }
    );
  }
}

// POST: Yeni kullanıcı oluştur
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST body:", body);

    // Şema doğrulama
    const parsed = userSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation error:", parsed.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, username, password, isAdmin } = parsed.data;
    console.log("Parsed data:", { email, username, isAdmin });

    // Email kontrolü
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      console.log("Email exists:", email);
      return NextResponse.json(
        { user: null, error: "Email already exists" },
        { status: 400 }
      );
    }

    // Kullanıcı adı kontrolü
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      console.log("Username exists:", username);
      return NextResponse.json(
        { user: null, error: "Username already exists" },
        { status: 400 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    // Veritabanına kaydet
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });
    console.log("Created user:", newUser);

    // Şifreyi yanıt dışı bırak
    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create user", details: String(error) },
      { status: 500 }
    );
  }
}
