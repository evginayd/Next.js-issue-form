"use client";

import { useEffect, useState } from "react";
// import { getSession } from "@/lib/authStore";

interface Stats {
  open: number;
  inProgress: number;
  closed: number;
}

export default function Dashboard() {
  // const session = await getSession();
  // console.log("🟢 Session bilgisi (server):", session);

  const [stats, setStats] = useState<Stats>({
    open: 0,
    inProgress: 0,
    closed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/issues/status");
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Open Issues</h2>
          <p className="text-3xl">{stats.open}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">In Progress Issues</h2>
          <p className="text-3xl">{stats.inProgress}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Closed Issues</h2>
          <p className="text-3xl">{stats.closed}</p>
        </div>
      </div>
    </div>
  );
}
