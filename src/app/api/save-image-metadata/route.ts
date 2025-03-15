// src/app/api/save-image-metadata/route.ts
"use server";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user.userId) {
      console.error("Unauthorized: No userId found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received request body:", body);
    const { fileUrl, fileName, caption } = body;

    if (!fileUrl || !fileName) {
      console.error("Missing required fields", { fileUrl, fileName });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(
      `Updating image metadata for user ${user.userId}, fileUrl: ${fileUrl}, caption: ${caption}`,
    );

    const result = await db
      .update(images)
      .set({ caption })
      .where(and(eq(images.url, fileUrl), eq(images.userId, user.userId)));

    console.log("Database update result:", result);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error saving image metadata:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
