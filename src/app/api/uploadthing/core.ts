// src/app/api/uploadthing/core.ts

import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Fetch the user's metadata from Clerk
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      ).then((res) => res.json());

      const userName = `${clerkUser.first_name} ${clerkUser.last_name}`;
      const metaImgUrl = clerkUser.profile_image_url; // Assuming the URL is stored under profile_image_url


      return { userId: user.userId, userName, metaImgUrl  };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      await db.insert(images).values({
        name: file.name,
        url: file.url,
        userId: metadata.userId,
        userName: metadata.userName,
        caption: "",
        userImg: metadata.metaImgUrl, // Include the meta image URL in the insert
      });
      console.log("File URL recorded:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
