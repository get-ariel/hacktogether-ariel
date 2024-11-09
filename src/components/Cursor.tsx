"use client";

import React, { useEffect, useState } from "react";
import {
  useStateTogetherWithPerUserValues,
  useLeaveSession,
  useConnectedUsers,
  useMyId,
} from "react-together";
import { useMap } from "@vis.gl/react-google-maps";

interface CursorPosition {
  lat: number;
  lng: number;
  color: string;
}

export function Cursor() {
  const map = useMap();
  const [overlayView, setOverlayView] =
    useState<google.maps.OverlayView | null>(null);
  const leaveSession = useLeaveSession();
  const connectedUsers = useConnectedUsers();
  const myId = useMyId();

  const [sharedValue, setSharedValue, userValues] =
    useStateTogetherWithPerUserValues<CursorPosition>(
      "cursor-position-state-v1",
      {
        lat: 0,
        lng: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      }
    );

  useEffect(() => {
    if (!map) return;

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {};
    overlay.draw = function () {};
    overlay.onRemove = function () {};
    overlay.setMap(map);
    setOverlayView(overlay);

    return () => {
      overlay.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    let lastUpdate = 0;
    const THROTTLE_MS = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        if (!overlayView || !overlayView.getProjection()) {
          return;
        }

        const projection = overlayView.getProjection();
        const google = window.google;

        const pixel = new google.maps.Point(e.clientX, e.clientY);
        const latLng = projection.fromContainerPixelToLatLng(pixel);
        if (!latLng) return;

        const position = {
          lat: latLng.lat(),
          lng: latLng.lng(),
          color: sharedValue.color,
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
  }, [setSharedValue, leaveSession, sharedValue.color, overlayView]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
      {Object.entries(userValues || {}).map(([userId, position]) => {
        if (userId === myId || !overlayView || !overlayView.getProjection())
          return null;

        const projection = overlayView.getProjection();
        const latLng = new google.maps.LatLng(position.lat, position.lng);
        const pixel = projection.fromLatLngToContainerPixel(latLng);

        if (!pixel) return null;

        const user = connectedUsers.find((u) => u.userId === userId);
        return (
          <div
            key={userId}
            style={{
              position: "absolute",
              left: pixel.x,
              top: pixel.y,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                pointerEvents: "none",
                position: "absolute",
                transform: "translate(-50%, -50%)",
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
                transform: "translate(8px, 8px)",
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
