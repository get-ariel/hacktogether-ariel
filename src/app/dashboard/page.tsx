"use client";

import ReactTogetherWrapper from "@/components/ReactTogetherWrapper";
import dynamic from "next/dynamic";

const DashboardComponent = dynamic(
  () =>
    import("@/components/DashboardComponent").then(
      (mod) => mod.DashboardComponent
    ),
  { ssr: false }
);

export default function MapPage() {
  return (
    <main>
      <ReactTogetherWrapper>
        <DashboardComponent />
      </ReactTogetherWrapper>
    </main>
  );
}
