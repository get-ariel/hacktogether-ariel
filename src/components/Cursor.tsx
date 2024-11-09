"use client";

import React, { useEffect } from "react";
import { useStateTogetherWithPerUserValues } from "react-together";

interface CursorPosition {
  x: number;
  y: number;
}

export function Cursor() {
  const [sharedValue, setSharedValue, userValues] =
    useStateTogetherWithPerUserValues<CursorPosition>(
      "cursor-position-state-v1",
      {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
      }
    );

  useEffect(() => {
    let lastUpdate = 0;
    const THROTTLE_MS = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        // Get the actual page-relative coordinates
        const position = {
          x: e.pageX,
          y: e.pageY,
        };
        setSharedValue(position);
        lastUpdate = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setSharedValue]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
      {Object.entries(userValues || {}).map(([userId, position]) => (
        <div
          key={userId}
          style={{
            position: "absolute",
            left: position?.x || 0,
            top: position?.y || 0,
            width: "20px",
            height: "20px",
            backgroundColor: `hsl(${hashString(userId) % 360}, 70%, 50%)`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            transition: "all 0.1s ease-out",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </div>
  );
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}
