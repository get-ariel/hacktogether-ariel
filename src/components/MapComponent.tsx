"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export function MapComponent() {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  console.log("API_KEY:", API_KEY);
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 38.736946, lng: -9.142685 }}
        defaultZoom={10}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      ></Map>
    </APIProvider>
  );
}
