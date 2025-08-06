import "server-only"; // Next.js 15 için server-only
import { PrismaClient } from "@prisma/client";
import { parse } from "path";

const prisma = new PrismaClient();

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export async function getUserDetails(
  userId: string | undefined
): Promise<UserProfile | null> {
  if (!userId) {
    console.log("No userId provided");
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }, // UUID string direkt kullanılır
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (!user) {
      console.log("No user found for userId:", userId);
      return null;
    }
    console.log("Fetched user:", user);

    return {
      id: user.id.toString(),
      name: user.username,
      email: user.email,
    };
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    return null;
  } finally {
    await prisma.$disconnect(); // Next.js 15'te bağlantı yönetimi
  }
}
