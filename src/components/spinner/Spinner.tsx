"use client";

import { SpinnerProps } from "@/models/UIModels";

export default function Spinner({ message }: SpinnerProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg">
        <svg
          className="animate-spin h-8 w-8 text-green-600 mb-3"
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
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-700 text-sm">{message}</p>
      </div>
    </div>
  );
}
