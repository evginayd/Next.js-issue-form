// lib/login.ts

"use client";

import { useRouter } from "next/navigation";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();

  const loginUser = async ({ email, password }: LoginCredentials) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }

      const user = await res.json();
      router.refresh();
      router.push("/"); // veya istediğin sayfa
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  return { loginUser };
};
