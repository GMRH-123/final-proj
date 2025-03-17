"use client";

import { useUser } from "@clerk/nextjs";

export default function UserView() {
  const { user } = useUser();

  return (
      <button className="mt-3 flex items-center justify-center rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="rounded-full border border-gray-300 shadow-sm"
            width={50}
            height={50}
            />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || "U"}
            </span>
          </div>
        )}
      </button>
  );
}