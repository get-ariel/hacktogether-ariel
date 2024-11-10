"use client";

import React, { useEffect, useState } from "react";
import {
  useStateTogetherWithPerUserValues,
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

  const [mapBounds, setMapBounds] = useState<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null>(null);

  useEffect(() => {
    if (!map) return;

    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {};
    overlay.draw = function () {};
    overlay.onRemove = function () {};
    overlay.setMap(map);
    setOverlayView(overlay);

    const updateMapBounds = () => {
      const mapDiv = map.getDiv();
      const rect = mapDiv.getBoundingClientRect();
      setMapBounds({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      });
    };

    updateMapBounds();
    map.addListener("idle", updateMapBounds);
    window.addEventListener("resize", updateMapBounds);

    return () => {
      overlay.setMap(null);
      window.removeEventListener("resize", updateMapBounds);
      google.maps.event.clearListeners(map, "idle");
    };
  }, [map]);

  useEffect(() => {
    let lastUpdate = 0;
    const THROTTLE_MS = 16;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate >= THROTTLE_MS) {
        if (!overlayView || !overlayView.getProjection() || !mapBounds) {
          return;
        }

        const x = e.clientX - mapBounds.left;
        const y = e.clientY - mapBounds.top;

        if (
          x < 0 ||
          x > mapBounds.right - mapBounds.left ||
          y < 0 ||
          y > mapBounds.bottom - mapBounds.top
        ) {
          return;
        }

        const projection = overlayView.getProjection();
        const point = new google.maps.Point(x, y);
        const latLng = projection.fromContainerPixelToLatLng(point);

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

    const mapContainer = map?.getDiv();
    if (mapContainer) {
      mapContainer.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (mapContainer) {
        mapContainer.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [setSharedValue, sharedValue.color, overlayView, mapBounds, map]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Object.entries(userValues || {}).map(([userId, position]) => {
        if (
          userId === myId ||
          !overlayView ||
          !overlayView.getProjection() ||
          !mapBounds
        )
          return null;

        const projection = overlayView.getProjection();
        const latLng = new google.maps.LatLng(position.lat, position.lng);
        const pixel = projection.fromLatLngToContainerPixel(latLng);

        if (!pixel) return null;

        const relativeX = pixel.x;
        const relativeY = pixel.y;

        const cursorSize = 4; // Half of the cursor width (8px/2)
        const labelHeight = 24; // Approximate height of the label
        const labelWidth = 100; // Approximate max width of the label

        // Check if cursor is within map bounds with minimal padding
        if (
          relativeX < cursorSize ||
          relativeX > mapBounds.right - mapBounds.left - cursorSize ||
          relativeY < cursorSize ||
          relativeY >
            mapBounds.bottom - mapBounds.top - (cursorSize + labelHeight)
        ) {
          return null;
        }

        const user = connectedUsers.find((u) => u.userId === userId);

        // Determine label position (above or below cursor) based on Y position
        const isNearBottom =
          relativeY > mapBounds.bottom - mapBounds.top - labelHeight - 20;
        const labelTransform = isNearBottom
          ? "translate(8px, -24px)"
          : "translate(8px, 8px)";

        return (
          <div
            key={userId}
            style={{
              position: "absolute",
              left: relativeX,
              top: relativeY,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pointerEvents: "none",
            }}
          >
            {/* Cursor dot */}
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
            {/* Label */}
            <div
              style={{
                padding: "2px 8px",
                backgroundColor: "rgba(0,0,0,0.8)",
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                transform: labelTransform,
                zIndex: 9999,
                maxWidth: `${labelWidth}px`,
                overflow: "hidden",
                textOverflow: "ellipsis",
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
