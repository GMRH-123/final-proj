// src/app/@modal/(.)img\[id]/modal.tsx

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

  // Ensure there is a modal-root element in your HTML (e.g., in _document.tsx)
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="m-0 h-screen w-screen bg-black/90 text-white"
      onClose={onDismiss}
    >
      {children}
    </dialog>,
    modalRoot
  );
}
