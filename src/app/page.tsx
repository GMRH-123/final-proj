import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Images() {
  const user = await  auth();

  
  // If you throw, the user will not be able to upload
  if (!user.userId) throw new Error("Unauthorized");
  
  const images = await db.query.images.findMany({
    where: (model) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) =>  desc(model.id),
  });

  return(
    
    <div className="flex flex-wrap gap-4">
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
