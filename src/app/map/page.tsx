"use client";

import ReactTogetherWrapper from "@/components/ReactTogetherWrapper";
import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("../../components/MapComponent").then((mod) => mod.MapComponent),
  { ssr: false }
);

export default function MapPage() {
  return (
    <main>
      <ReactTogetherWrapper>
        <MapComponent />
      </ReactTogetherWrapper>
    </main>
  );
}
