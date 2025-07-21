"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaBug } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import classnames from "classnames";

const NavBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const currentPath = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/current");
        if (!res.ok) return;
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  };

  if (!mounted) return null;

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center justify-between">
      <div className="flex space-x-6 items-center">
        <Link href="/">
          <FaBug size={30} />
        </Link>
        <ul className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              className={classnames({
                "text-zinc-900": link.href === currentPath,
                "text-zinc-500": link.href !== currentPath,
                "hover:text-zinc-800 transition-colors": true,
              })}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <Button onClick={toggleTheme} variant="ghost">
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              👋 {user.username}
            </span>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
