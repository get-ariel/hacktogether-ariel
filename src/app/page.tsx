"use client";

import dynamic from "next/dynamic";

const Counter = dynamic(
  () => import("../components/Counter").then((mod) => mod.Counter),
  { ssr: false }
);

const Cursor = dynamic(
  () => import("../components/Cursor").then((mod) => mod.Cursor),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <Counter />
      <Cursor />
    </main>
  );
}
