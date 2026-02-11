import { useEffect, useState } from "react";
import  TabsAdmin from "../custom components/AdminSwitch";
import  Menu  from "../custom components/Menu";
import { useUser } from '@clerk/nextjs';
import { useRouter } from "next/router";

export default function Admin() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isLoaded) {
        if (!isSignedIn) {
          // Redirect to sign-in if not signed in
          router.push("/sign-in");
          return;
        }

        // Check if user has admin role in public metadata
        const userRole = user?.publicMetadata?.role as string | undefined;

        if (userRole === "admin") {
          setIsAdmin(true);
        } else {
          // Not an admin, redirect to home
          router.push("/");
        }
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <>
      {isAdmin && (
        <main className="">
          <nav className="p-6 space-x-6 ">
            <Menu />
          </nav>
          <div className="flex justify-center">
            <TabsAdmin />
          </div>
        </main>
      )}
    </>
  );
}




