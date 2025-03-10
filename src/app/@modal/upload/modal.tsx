// src/app/@modal/(.)upload/modal.tsx
"use client";

import { useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  // Check if modal-root exists
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null; // Return null if modal-root is not found

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-0 h-screen w-screen bg-black/90 text-white"
      onClose={onDismiss}
    >
      {children}
    </dialog>,
    modalRoot, // Use the modal-root element
  );
}