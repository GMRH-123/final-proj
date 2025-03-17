// src/app/components/UploadModal.tsx

"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

export default function UploadModal() {
  return (
    <Link href="/upload" className="w-full">
      <div
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-white p-3 text-left shadow-sm hover:border-blue-500 focus:outline-none"
      >
        {/* Image Icon */}
        <ImageIcon className="h-5 w-5 text-gray-500" />

        {/* Input Placeholder */}
        <div className="flex-grow rounded-xl bg-gray-100 px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none">
            What’s your pet up to today?
        </div>
      </div>
    </Link>
  );
}