"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(
  () => import("../../components/MapComponent").then((mod) => mod.MapComponent),
  { ssr: false }
);

export default function MapPage() {
  return (
    <main>
      <MapComponent />
    </main>
  );
}
