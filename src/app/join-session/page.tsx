"use client";

import dynamic from "next/dynamic";

const JoinSessionContent = dynamic(
  () => import("@/components/join-session-content"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse w-full max-w-md space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    ),
  }
);

export default function JoinSession() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#fffdf9]">
      <JoinSessionContent />
    </div>
  );
}
