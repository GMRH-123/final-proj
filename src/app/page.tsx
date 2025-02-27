import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/server/db";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  const images =  await getMyImages();

  return(
    
    <div className="flex flex-wrap justify-items-center gap-4">
      {images.map((image) => (
        <div key={image.id} className="w-48">
          <img src={image.url} />
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {

  return (
    <main className="">

      <SignedOut>
        <div className="h-full w-full text-2xl text-center">Please Sign In Above</div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>

    </main>
  );
}
