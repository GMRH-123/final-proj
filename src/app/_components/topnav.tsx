"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {

  return (
    <nav className="flex w-full items-center justify-between bg-neutral-900 py-3 px-8 text-xl font-semibold ">
      <h1 className="text-neutral-300 text-xl tracking-wider">Pet Gallery</h1>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}