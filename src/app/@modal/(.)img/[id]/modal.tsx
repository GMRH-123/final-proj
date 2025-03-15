// app/@modal/(.)img\[id]/modal.tsx

"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, type ElementRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "~/components/ui/button"

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const dialogRef = useRef<ElementRef<"dialog">>(null)
    const overlayRef = useRef<ElementRef<"div">>(null)

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal()
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onDismiss()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    function onDismiss() {
        if (dialogRef.current) {
            // Add fade-out effect
            dialogRef.current.classList.add("opacity-0")
            setTimeout(() => {
                // Explicitly close the dialog before navigating back
                dialogRef.current?.close()
                router.back()
            }, 200)
        } else {
            router.back()
        }
    }

    function handleOverlayClick(e: React.MouseEvent) {
        if (e.target === overlayRef.current) {
            onDismiss()
        }
    }

    // Ensure a modal-root exists in the DOM.
    const modalRoot = document.getElementById("modal-root")
    if (!modalRoot) return null

    return createPortal(
        <dialog
            ref={dialogRef}
            className="m-0 h-screen w-screen bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm transition-opacity duration-200 ease-in-out"
            onClose={onDismiss}
        >
            <div
                ref={overlayRef}
                className="flex h-full w-full items-center justify-center p-4 md:p-8"
                onClick={handleOverlayClick}
            >
                <div className="relative max-h-[90vh] w-full max-w-4xl rounded-lg bg-background shadow-lg">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-10 rounded-full bg-background/80 p-1 text-foreground backdrop-blur-sm hover:bg-background/90"
                        onClick={onDismiss}
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                    {children}
                </div>
            </div>
        </dialog>,
        modalRoot,
    )
}

