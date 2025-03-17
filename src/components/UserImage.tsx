// src/app/components/UserView.tsx

"use client";

import { useUser } from "@clerk/nextjs";

export default function UserView() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center gap-2">
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt="User Avatar"
          width={200} // Increased size
          height={200} // Increased size
          className="rounded-full border-4 border-white shadow-lg" // Added border and shadow
        />
      ) : (
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
          <span className="text-gray-600 text-2xl font-bold">
            {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U"}
          </span>
        </div>
      )}
      <p className="text-xl font-bold text-gray-800">
        {user?.fullName || `${user?.firstName} ${user?.lastName}` || user?.username || "User"}
      </p>
    </div>
  );
}