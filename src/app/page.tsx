"use client";

import dynamic from "next/dynamic";

const Counter = dynamic(
  () => import("../components/Counter").then((mod) => mod.Counter),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <Counter />
    </main>
  );
}
