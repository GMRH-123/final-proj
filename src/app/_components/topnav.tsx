

"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {

  return (
    <nav className="flex w-full items-center justify-between bg-neutral-900 py-3 px-8 text-xl font-semibold">
      <div className="flex items-center gap-2">
        <img
          className="h-8 w-auto" 
          src="https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ct4q5lAupGMuzlwvB8sUkRFYHK9iINTfe6LnAX"
          alt="Logo" 
        />
        <h1 className="text-neutral-300 text-xl tracking-wider">Pet Gallery</h1>
      </div>

      <div className="flex flex-row items-center gap-4">
        <SignedOut>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}