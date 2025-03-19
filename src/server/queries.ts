// src/server/queries.ts

import "server-only";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { and, eq } from "drizzle-orm";
import { images } from "./db/schema";
import { redirect } from "next/navigation";
import analyticsServerClient from "./analytics";

export async function getMyImages(){
    const user = await  auth();
  // If you throw, the user will not be able to upload
  if (!user.userId) throw new Error("Unauthorized");
  
   // Homepage where you can see the post of other users
  const images = await db.query.images.findMany({
    // where: (model) => eq(model.userId, user.userId),
    orderBy: (model, { desc }) =>  desc(model.id),
  });

  return images;
}

export async function getMyUserImages(){
  const user = await  auth();
// If you throw, the user will not be able to upload
if (!user.userId) throw new Error("Unauthorized");

 // Homepage where you can see the post of other users
const images = await db.query.images.findMany({
  where: (model) => eq(model.userId, user.userId),
  orderBy: (model, { desc }) =>  desc(model.id),
});

return images;
}

export async function getImage(id: number){
  const user = await  auth();
// If you throw, the user will not be able to upload
if (!user.userId) throw new Error("Unauthorized");

const image = await db.query.images.findFirst({
  where: (model, {eq}) => eq(model.id, id),
});

if (!image) throw new Error("Image not found");

// if (image.userId !== user.userId) throw new Error ("Unauthorized");

return image;
}

// Delete a post
export async function deleteImage(id:number) {
  const user = await auth();
  if (!user.userId) throw new Error("Unauthorized");

  await db.delete(images).where(and(eq(images.id, id), eq(images.userId, user.userId)));

  analyticsServerClient.capture({
    distinctId: user.userId,
    event: "delete image",
    properties: {
      imageId: id,
    }
  })

  redirect ("/user-page")
}
