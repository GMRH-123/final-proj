"use client";

import { useState } from "react";
import { useUploadThing } from "~/utils/uploadthing";
import { Modal } from "./modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

export default function UploadModal() {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const posthog = usePostHog();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin() {

      posthog.capture("Upload Begin");

      toast.loading("Uploading...", { id: "upload-begin" });
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
        toast.success(<span className="text-lg">Upload Complete!</span>);
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
        <div className="flex flex-col gap-4 p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
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
            className="rounded border p-2 text-black"
            disabled={isUploading}
          />

          {/* Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => router.back()}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              disabled={isUploading}
            >
              Close
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
