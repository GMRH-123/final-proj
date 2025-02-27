import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { db } from "~/server/db";
import { getMyImages } from "~/server/queries";

export const dynamic = "force-dynamic";

async function Images() {
  const images =  await getMyImages();

  return(
    
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {images.map((image) => (
        <div key={image.id} className="flex w-48 flex-col">
          <Image 
          src={image.url} 
          style={{objectFit: "contain"}} 
          width={200} 
          height={200}
          alt={image.name}
          />
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
