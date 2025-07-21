"use client";

export interface User {
  id: number;
  username: string;
  email: string;
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/current", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return null;

  return res.json();
}

export async function logout() {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include",
  });

  window.location.href = "/login"; // logout sonrası yönlendirme
}
