"use server";

//import { db } from '@/drizzle/db';
import { prisma as db } from "@/lib/db";
//import { users } from '@/drizzle/schema';
import { createSession, deleteSession } from "@/app/auth/stateless-session";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod";
import { compare } from "bcrypt";

//Define a schema for input validation
const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(25),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

// Giriş formundaki verileri kontrol etmek için şema
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
export async function signup(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);
    //check if the email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, error: "Email already exists" },
        { status: 400 }
      );
    }

    //check if the username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    //Store data to the database
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // more secure
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: newUser, meessage: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }

  // // 4. Create a session for the user
  // const userId = user.id.toString();
  // await createSession(userId);
}

export async function login(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const userId = user.id.toString(); // Now TypeScript knows user is not null
    await createSession(userId);

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

export async function logout() {
  deleteSession();
}
