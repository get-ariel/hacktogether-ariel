"use client";

import React, { useEffect } from "react";
import {
  useStateTogetherWithPerUserValues,
  useLeaveSession,
  useConnectedUsers,
  useMyId,
} from "react-together";

interface CursorPosition {
  x: number;
  y: number;
  color: string;
}

export function Cursor() {
  console.log("Cursor component mounting");

  const leaveSession = useLeaveSession();
  const connectedUsers = useConnectedUsers();
  const myId = useMyId();

  const [sharedValue, setSharedValue, userValues] =
    useStateTogetherWithPerUserValues<CursorPosition>(
      "cursor-position-state-v1",
      {
        x: Math.floor(Math.random() * window.innerWidth),
        y: Math.floor(Math.random() * window.innerHeight),
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }
    );

  useEffect(() => {
    console.log("Initial mount effect");
    return () => {
      console.log("Component unmounting");
    };
  }, []);

  useEffect(() => {
    console.log("Connected users:", connectedUsers);
    console.log("User values:", userValues);
    console.log("My ID:", myId);
  }, [connectedUsers, userValues, myId]);

  useEffect(() => {
    let lastUpdate = 0;
    const THROTTLE_MS = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        const position = {
          x: e.pageX,
          y: e.pageY,
          color: sharedValue.color, // Preserve the initially assigned color
        };
        setSharedValue(position);
        lastUpdate = now;
      }
    };

    const handleBeforeUnload = () => {
      leaveSession();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setSharedValue, leaveSession, sharedValue.color]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
      {Object.entries(userValues || {}).map(([userId, position]) => {
        if (userId === myId) return null;
        const user = connectedUsers.find((u) => u.userId === userId);
        return (
          <div
            key={userId}
            style={{
              position: "absolute",
              left: position?.x || 0,
              top: position?.y || 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                position: "absolute",
                zIndex: 9999,
                backgroundColor:
                  position?.color || `hsl(${Math.random() * 360}, 70%, 50%)`,
                borderRadius: "50%",
                border: "1px solid black",
              }}
            />
            <div
              style={{
                padding: "2px 8px",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                transform: "translate(16px, 16px)",
                zIndex: 9999,
              }}
            >
              {user?.name || "Anonymous"}
            </div>
          </div>
        );
      })}
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
