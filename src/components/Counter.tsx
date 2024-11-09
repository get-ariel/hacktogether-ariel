"use client";

import { useStateTogether } from "react-together";

export function Counter() {
  const [count, set_count] = useStateTogether<number>("counter_0", 0);

  return (
    <div>
      <h1>ReactTogether + Next.JS</h1>
      <div className="card">
        <button onClick={() => set_count((prevCount) => prevCount + 1)}>
          Synq&apos;d count is {count}
        </button>
        <button className="ml-4" onClick={() => set_count(0)}>
          Reset
        </button>
      </div>
    </div>
  );
}
