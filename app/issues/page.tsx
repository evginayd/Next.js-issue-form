// import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// const IssuesPage = () => {
//   return (
//     <main>
//       <div>
//         <Button>
//           <Link href="/issues/new">New Issue</Link>
//         </Button>
//       </div>
//     </main>
//   );
// };

// export default IssuesPage;

import { stackServerApp } from "../stack";
import { SignUp } from "@stackframe/stack";
import React from "react";
import InventoryTable from "@/components/InventoryTable";

async function page() {
  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;
  return (
    <>
      {user ? (
        <div>
          <div className="lg:col-span-full">
            <InventoryTable />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <SignUp />
        </div>
      )}
    </>
  );
}

export default page;
