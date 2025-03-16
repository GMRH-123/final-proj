// src/app/page.tsx

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { getMyImages } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { timeAgo } from "~/utils/helpers";
import WelcomeMessage from "~/components/WelcomeMessage";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await getMyImages();

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      {images.map((image) => (
        <Card key={image.id} className="w-full pt-4 overflow-hidden transition-all duration-200 hover:shadow-lg border-b">
          <CardContent className="p-1 mt-2 italic text-gray-600 text-sm text-right">
            {`Uploaded: ${timeAgo(new Date(image.createdAt))}`}
          </CardContent>
          <Link href={`/img/${image.id}`} className="block w-full h-[400px] overflow-hidden bg-muted pr-4 pl-4">
            <div className="relative h-full w-full">
            <img
                src={image.url || "/placeholder.svg"}
                alt={image.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0.5rem"
                }}
                loading="lazy"
              />
            </div>
          </Link>
          <div className="p-4 border-b">
            <h3 className="font-medium text-gray-800 bg-gray-100 px-3 py-2 rounded-lg">
              {image.caption ? image.caption : "No caption"}
            </h3>
          </div>

        </Card>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SignedOut>
        <div className="relative overflow-hidden">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-16 pb-8 md:pt-24 md:pb-16 lg:pt-32 lg:pb-24 flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 lg:pr-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Store and share</span>
                  <span className="block text-primary">your images easily</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:mx-0">
                  Upload, organize, and share your images in one secure place. Access your photos from anywhere,
                  anytime.
                </p>
                <div 
                    className="mt-8 px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 transition duration-300 cursor-pointer text-center"
                  >
                    <SignInButton mode="modal">
                      Sign In
                    </SignInButton>
                  </div>



              </div>
              <div className="md:w-1/2 mt-12 md:mt-0">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 z-10 rounded-lg"></div>
                  <div className="grid grid-cols-2 gap-2 p-4 absolute inset-0">
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg shadow-sm h-40 overflow-hidden">
                        <img
                          src="https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctEovAJ9GHAPpaqdrOBmLFz7NfCJEoeh0U8SIx"
                          alt="Gallery preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm h-40 overflow-hidden">
                        <img
                          src="https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctQdV6Lc4NyPovsDzXGaeJpH3m8i60fY1tKbIU"
                          alt="Gallery preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="bg-white rounded-lg shadow-sm h-40 overflow-hidden">
                        <img
                          src="https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctzy2H1WXTtiKuWCAIsV3YNMrgHcdB0n64TeqP"
                          alt="Gallery preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-white rounded-lg shadow-sm h-40 overflow-hidden">
                        <img
                          src="https://u4ocvzai6f.ufs.sh/f/5zX1RPP9E6ctlRtjnRoVBiLunfsD5WS3mxReUQjZvwpXy0MK"
                          alt="Gallery preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="sticky top-0 z-10 bg-gray-50">
          <div className="max-w-3xl mx-auto flex justify-between items-center py-4 px-4 shadow-lg w-full rounded-b-lg bg-gray-100">
            <WelcomeMessage />
            <Link href="/upload">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Upload Image
              </Button>
            </Link>
          </div>
        </div>
        <div className="py-4 px-4">
          <Images />
        </div>
      </SignedIn>
    </main>
  );
}
