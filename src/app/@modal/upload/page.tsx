// src/app/@modal/upload/page.tsx

"use client";

import { useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function UploadModal() {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const posthog = usePostHog();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin() {

      posthog.capture("Upload Begin");

      // toast.loading("Uploading...", { id: "upload-begin" });
    },
    onClientUploadComplete: async (uploadedFiles) => {
      toast.dismiss("upload-begin"); // Remove the loading toast

      if (!uploadedFiles || uploadedFiles.length === 0) {
        console.error("No uploaded file found.");
        toast.error("Upload failed. No file received.");
        return;
      }

      const fileData = uploadedFiles[0]!;
      console.log("File data received:", fileData);

      try {
        console.log("Sending metadata to /api/save-image-metadata", {
          fileUrl: fileData.url,
          fileName: fileData.name,
          caption: caption,
        });

        const response = await fetch("/api/save-image-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileUrl: fileData.url,
            fileName: fileData.name,
            caption: caption,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to save image metadata:", errorData);
          toast.error("Failed to save image metadata.");
          return;
        }

        console.log("Metadata saved successfully.");
        toast.success(<span className="">Upload Complete!</span>);
      } catch (error) {
        console.error("Error saving image metadata:", error);
        toast.error("An error occurred while saving metadata.");
      }

      // Close the modal and refresh the page
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 100);
    },
    onUploadError: (error) => {
      console.error("Upload failed:", error);
      toast.dismiss("upload-begin"); // Ensure the loading toast is removed
      toast.error("Upload failed. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles([file]);
      setPreviewUrl(URL.createObjectURL(file));
      console.log("File selected:", file);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      console.log("Starting upload for files:", files);
      await startUpload(files);
      console.log("startUpload promise resolved");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <Modal>
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
    <div className="relative flex flex-col gap-4 p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
      
      {/* Close Button (X) */}
      <Button
        onClick={() => router.back()}
        className="absolute top-4 right-4"
        disabled={isUploading}
      >
        <X className="h-5 w-5" />
      </Button>

      <h2 className="text-2xl font-bold text-center">Upload Image</h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="rounded border p-2"
        disabled={isUploading}
      />

      {/* Image Preview */}
      {previewUrl && (
        <div className="flex justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-48 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Caption Input */}
      <textarea
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 text-base text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        disabled={isUploading}
        rows={4} // Adjust the number of rows as needed
      />

      {/* Upload Button */}
      <div className="flex justify-center"> {/* Center the button */}
        <button
          onClick={handleUpload}
          disabled={isUploading || files.length === 0}
          className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {/* Upload Icon or Spinner */}
          {isUploading ? (
            <svg
              className="h-5 w-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          )}

          {/* Button Text */}
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  </div>
</Modal>

  );
}
