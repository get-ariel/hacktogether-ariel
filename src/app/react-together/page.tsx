"use client";

import ReactTogetherWrapper from "@/components/ReactTogetherWrapper";
import dynamic from "next/dynamic";

const Counter = dynamic(
  () => import("@/components/Counter").then((mod) => mod.Counter),
  { ssr: false }
);

const CreateRandomSessionButton = dynamic(
  () =>
    import("@/components/CreateRandomSessionButton").then(
      (mod) => mod.CreateRandomSessionButton
    ),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <ReactTogetherWrapper>
        <Counter />
        <CreateRandomSessionButton />
      </ReactTogetherWrapper>
    </main>
  );
}
