"use client";

import { useRouter } from "next/navigation";

export async function logout() {
  await fetch("/api/logout", { method: "POST" });

  // Tarayıcı tarafında cache'lenmiş veri varsa sıfırlanır
  window.location.href = "/login"; // veya router.push("/login")
}

export default logout;
