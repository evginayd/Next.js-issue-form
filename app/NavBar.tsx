"use client";
import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaBug } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import classnames from "classnames";
const NavBar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const currentPath = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // SSR sırasında hiçbir şey render etme
  }
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues" },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
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
        <Button onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </ul>
    </nav>
  );
};

export default NavBar;
