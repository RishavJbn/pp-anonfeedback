"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { LogInIcon, LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="w-full border-b bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <div>
          <Link href="/" className="text-lg font-semibold">
            AnonFeedback
          </Link>
        </div>
        <div>
          {session ? (
            <div className="flex flex-row gap-2">
              <div className="text-white underline text-shadow-amber-300">
                <p> {user?.username || user?.email || "unknown"}</p>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="rounded-xl text-white border-2 border-blue-500 "
                variant={"ghost"}
              >
                Logout
              </Button>
              <LogOutIcon />
            </div>
          ) : (
            <Link href="/signin">
              <Button className="rounded-xl text-white border-2 border-blue-500 ">
                Login
              </Button>
              <LogInIcon />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
