// src/app/components/WelcomeMessage.tsx

"use client";

import { useUser } from "@clerk/nextjs";

export default function WelcomeMessage() {
    const { user } = useUser();

    return (
        <h1 className="text-2xl font-bold text-gray-800">
            {user ? `Welcome back, ${user.firstName || user.fullName || "User"}!` : "Welcome back!"}
        </h1>
    );
}
