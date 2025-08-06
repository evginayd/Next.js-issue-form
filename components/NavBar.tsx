import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  HomeIcon,
  LogIn,
  LogInIcon,
  LogOutIcon,
  Sprout,
  TriangleAlert,
} from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { stackServerApp } from "@/app/stack";
// import { getUserDetails } from "@/actions/user.action";
import { UserButton } from "@stackframe/stack";
import { FaBug } from "react-icons/fa6";

async function Navbar() {
  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;
  // const userProfile = await getUserDetails(user?.id);
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center justify-between">
      <div className="flex space-x-6 items-center">
        <Link href="/">
          <FaBug size={30} />
        </Link>
      </div>

      {/* Navbar components */}
      {/* 
      {userProfile?.name && (
        <span className="text-[14px] text-gray-600 dark:text-gray-300">
          {`Hello, ${userProfile?.name.split(" ")[0]}`}
        </span>
      )} */}
      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href="/">
            <HomeIcon size={16} className="w-4 h-4" />
            <span className="hidden lg:inline">Home</span>
          </Link>
        </Button>

        <Button variant="ghost" className="flex items-center gap-2" asChild>
          <Link href="/issues">
            <TriangleAlert size={16} className="w-4 h-4" />
            <span className="hidden lg:inline">Issues</span>
          </Link>
        </Button>
        <ModeToggle />

        {user ? (
          <>
            {/*Signout Button */}
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              asChild
            >
              <Link href={app.signOut}>
                <LogOutIcon size={16} className="w-4 h-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </Link>
            </Button>

            <UserButton />
          </>
        ) : (
          <>
            {/* Sign in button */}
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href={app.signIn}>
                <LogInIcon size={16} className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

// "use server";
// // import { useEffect, useState } from "react";
// import Link from "next/link";
// // import { useTheme } from "next-themes";
// // import { Sun, Moon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { FaBug } from "react-icons/fa6";
// // import { usePathname, useRouter } from "next/navigation";
// // import classnames from "classnames";
// import { ModeToggle } from "./ModeToggle";
// import { LogInIcon, LogOutIcon } from "lucide-react";
// import { stackServerApp } from "@/stack";
// import { getUserDetails } from "@/actions/user.action";
// import { UserButton } from "@stackframe/stack";

// async function NavBar() {
//   // const { theme, setTheme } = useTheme();
//   // const [mounted, setMounted] = useState(false);
//   // const [user, setUser] = useState<{ username: string } | null>(null); //usestate ile alakalı bir sorun olabilir
//   // const currentPath = usePathname();
//   // const router = useRouter();

//   const user = await stackServerApp.getUser();
//   const app = stackServerApp.urls;
//   const userProfile = await getUserDetails(user?.id);

//   // useEffect(() => {
//   //   setMounted(true);
//   // }, []);

//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     try {
//   //       const res = await fetch("/api/auth/current");
//   //       if (!res.ok) return;
//   //       const data = await res.json();
//   //       setUser(data);
//   //     } catch (error) {
//   //       console.error("Error fetching user", error);
//   //     }
//   //   };

//   //   fetchUser();
//   // }, []);

//   // const toggleTheme = () => {
//   //   setTheme(theme === "dark" ? "light" : "dark");
//   // };

//   // const handleLogout = async () => {
//   //   await fetch("/api/logout", { method: "POST" });
//   //   setUser(null);
//   //   router.push("/login");
//   // };

//   // if (!mounted) return null;

//   // const links = [
//   //   { label: "Dashboard", href: "/" },
//   //   { label: "Issues", href: "/issues" },
//   // ];

//   return (
//     <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center justify-between">
//       <div className="flex space-x-6 items-center">
//         <Link href="/">
//           <FaBug size={30} />
//         </Link>
//         {/* <ul className="flex space-x-6">
//           {links.map((link) => (
//             <Link
//               key={link.href}
//               className={classnames({
//                 "text-zinc-900": link.href === currentPath,
//                 "text-zinc-500": link.href !== currentPath,
//                 "hover:text-zinc-800 transition-colors": true,
//               })}
//               href={link.href}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </ul> */}
//       </div>

//       <div className="flex items-center space-x-4">
//         {/* Navbar components */}

//         {userProfile?.name && (
//           <span className="text-[14px] text-gray-600 dark:text-gray-300">
//             {`Hello, ${userProfile?.name.split(" ")[0]}`}
//           </span>
//         )}
//         {/* <Button onClick={toggleTheme} variant="ghost">
//           {theme === "dark" ? (
//             <Sun className="h-5 w-5" />
//           ) : (
//             <Moon className="h-5 w-5" />
//           )}
//         </Button> */}
//         <ModeToggle />
//         {/* {user ? (
//           <>
//             <span className="text-sm text-muted-foreground">
//               👋 {user.username}
//             </span>
//             <Button onClick={handleLogout} variant="destructive">
//               Logout
//             </Button>
//           </>
//         ) : (
//           <Link href="/login">
//             <Button variant="default">Login</Button>
//           </Link>
//         )} */}
//         {user ? (
//           <>
//             {/*Signout Button */}
//             <Button
//               variant="secondary"
//               className="flex items-center gap-2"
//               asChild
//             >
//               <Link href={app.signOut}>
//                 <LogOutIcon size={16} className="w-4 h-4" />
//                 <span className="hidden lg:inline">Sign Out</span>
//               </Link>
//             </Button>
//             <UserButton />

//             {/* <UserButton /> */}
//           </>
//         ) : (
//           <>
//             {/* Sign in button */}
//             <Button variant="ghost" className="flex items-center gap-2" asChild>
//               <Link href={app.signIn}>
//                 <LogInIcon size={16} className="w-4 h-4" />
//                 <span className="hidden lg:inline">Sign In</span>
//               </Link>
//             </Button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default NavBar;
