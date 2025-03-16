// src/app/components/full-image-page.tsx

import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { CalendarIcon, UserIcon } from "lucide-react";
import { getImage } from "~/server/queries";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import BackButton from "~/components/BackButton";

export default async function FullPageImageView(props: { id: number }) {
    const image = await getImage(props.id);

    let uploaderInfo;
    try {
        uploaderInfo = await (await clerkClient()).users.getUser(image.userId);
    } catch (error) {
        console.error("Error fetching user info:", error);
        uploaderInfo = { fullName: "Unknown User" };
    }

    const formattedDate = new Date(image.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">

            <Card className="overflow-hidden bg-white shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
                    <div className="md:col-span-2 flex items-center justify-center bg-slate-50 p-4 relative">
                        <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
                            {image.url ? (
                                <Image
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.name || "Image"}
                                    className="object-contain max-h-[70vh] rounded-md"
                                    width={800}
                                    height={600}
                                />
                            ) : (
                                <div className="bg-slate-200 rounded-md w-full h-full min-h-[300px] flex items-center justify-center">
                                    <p className="text-slate-500">Image not available</p>
                                </div>
                            )}
                        </div>

                        {image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 border backdrop-blur-sm">
                                <p className="text-sm md:text-base">{image.caption}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col p-6 space-y-4">

                        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 line-clamp-2">
                            {image.name || "Untitled Image"}
                        </h1>
                        <Separator />
                        <div className="space-y-4 flex-grow">
                            <div className="flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Uploaded by</p>
                                    <p className="font-medium">{uploaderInfo.fullName}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="text-sm text-gray-500">Uploaded on</p>
                                    <p className="font-medium">{formattedDate}</p>
                                </div>
                            </div>
                        </div>
                        <BackButton />
                    </div>
                </div>
            </Card>
        </div>
    );
}
