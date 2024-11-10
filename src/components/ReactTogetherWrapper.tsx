"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactTogether with SSR disabled
const ReactTogether = dynamic(
  () => import("react-together").then((mod) => mod.ReactTogether),
  { ssr: false }
);

export default function ReactTogetherWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <ReactTogether
        sessionParams={{
          appId: process.env.NEXT_PUBLIC_APP_ID || "",
          apiKey: process.env.NEXT_PUBLIC_API_KEY || "",
        }}
      >
        {children}
      </ReactTogether>
    </>
  );
}
