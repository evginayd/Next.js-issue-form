import { getSession } from "@/lib/authStore";

export default async function Home() {
  const session = await getSession();
  console.log("🟢 Session bilgisi (server):", session);

  return <div className="p-5">Hello World</div>;
}
