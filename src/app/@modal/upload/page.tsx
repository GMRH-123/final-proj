// src/app/@modal/(.)upload/page.tsx
"use client";

import { useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";

export default function UploadModal() {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload, isUploading } = useUploadThing("imageUploader");
  const router = useRouter();

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select a file to upload.");
      return;
    }
  
    try {
      const uploadedFiles = await startUpload(files);
      if (uploadedFiles) {
        console.log("Uploaded files:", uploadedFiles);
        alert("Upload successful!");
  
        // Close the modal and return to the previous page
        router.back();
  
        // Refresh the page to load the new image
        router.refresh();
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <Modal>
      <div className="flex flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">Upload Image</h2>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          className="rounded border p-2"
          disabled={isUploading}
        />

        {/* Caption Input */}
        <textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="rounded border p-2 text-black"
          disabled={isUploading}
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          <button
            onClick={() => router.back()} // Close the modal
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            disabled={isUploading}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}