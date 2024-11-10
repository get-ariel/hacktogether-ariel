"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Cursor } from "@/components/Cursor";
import { useState, useCallback } from "react";

export function MapComponent(): JSX.Element {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  interface PoiInfo {
    position: google.maps.LatLngLiteral;
    name: string;
    address: string;
    website?: string;
    photoUrl?: string | null;
  }

  const [poiInfo, setPoiInfo] = useState<PoiInfo | null>(null);

  const handleMarkerClick = useCallback(() => {
    setInfoWindowShown((shown) => !shown);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setInfoWindowShown(false);
    setPoiInfo(null);
  }, []);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    const { detail } = e;

    if (detail.placeId && detail.latLng) {
      // Prevent the default info window from appearing
      e.stop();
      const service = new google.maps.places.PlacesService(e.map);
      service.getDetails({ placeId: detail.placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setPoiInfo({
            position: {
              lat: detail.latLng!.lat,
              lng: detail.latLng!.lng,
            },
            name: place.name || "Unknown Place",
            address: place.formatted_address || "No address available",
            website: place.website,
            photoUrl: place.photos?.[0]?.getUrl() || null,
          });
        }
      });
    } else {
      // Handle non-POI clicks if needed
      setPoiInfo(null);
    }
  }, []);

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 38.736946, lng: -9.142685 }}
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapId="cc6289491cc9a804" // Your custom map ID with POIs hidden
        onClick={handleMapClick}
        // Removed styles prop since mapId is being used
      >
        <Cursor />
        <AdvancedMarker
          position={{ lat: 38.736946, lng: -9.142685 }}
          onClick={handleMarkerClick}
          ref={markerRef}
        >
          <Pin
            background="#4285F4"
            borderColor="#1967D2"
            glyphColor="#FFFFFF"
            scale={1.2}
          />
        </AdvancedMarker>

        {infoWindowShown && (
          <InfoWindow anchor={marker} onClose={handleInfoWindowClose}>
            <div className="p-2">
              <h3 className="font-bold text-lg">Madre Deus</h3>
              <p className="text-gray-600">1900-160 Lisbon</p>
              <p className="text-gray-600">Portugal</p>
              <a
                href="https://maps.google.com/?q=Madre+Deus,Lisbon,Portugal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View on Google Maps
              </a>
            </div>
          </InfoWindow>
        )}

        {poiInfo && (
          <AdvancedMarker position={poiInfo.position}>
            <Pin
              background="#FF0000"
              borderColor="#B20000"
              glyphColor="#FFFFFF"
              scale={1}
            />
            <InfoWindow
              position={poiInfo.position}
              onClose={handleInfoWindowClose}
            >
              <div className="p-2">
                <h3 className="font-bold text-lg">{poiInfo.name}</h3>
                <p className="text-gray-600">{poiInfo.address}</p>
                {poiInfo.photoUrl && (
                  <img
                    src={poiInfo.photoUrl}
                    alt={poiInfo.name}
                    className="w-full h-auto mb-2"
                  />
                )}
                {poiInfo.website && (
                  <a
                    href={poiInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Visit Website
                  </a>
                )}
                <button
                  onClick={() => alert("Button clicked!")}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Custom Button
                </button>
              </div>
            </InfoWindow>
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
