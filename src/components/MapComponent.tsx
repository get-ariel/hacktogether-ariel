"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
  MapMouseEvent,
  MapCameraChangedEvent,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { Cursor } from "@/components/Cursor";
import { useState, useCallback, useRef, useEffect } from "react";

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
  const [zoom, setZoom] = useState(10);

  const handleZoomChanged = useCallback((e: MapCameraChangedEvent) => {
    setZoom(e.detail.zoom || 10);
  }, []);

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
      // Close any existing InfoWindow first
      setPoiInfo(null);

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

  // SearchBox Component
  function SearchBox() {
    const map = useMap();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(
      null
    );

    useEffect(() => {
      if (!inputRef.current || !window.google || !window.google.maps) return;
      if (!window.google.maps.places) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current!,
        {
          fields: ["geometry", "name", "formatted_address"],
        }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        if (map) {
          map.panTo(place.geometry.location);
          map.setZoom(15);
        }
      });

      return () => {
        // Clean up listener
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }, [map]);

    return (
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for places..."
          style={{
            width: "400px",
            padding: "12px 16px",
            margin: "10px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          className="hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <style jsx global>{`
          /* Autocomplete container */
          .pac-container {
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            font-family: system-ui, -apple-system, sans-serif;
            margin-top: 8px;
            padding: 8px 0;
            background-color: white;
          }

          /* Individual suggestion items */
          .pac-item {
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .pac-item:hover {
            background-color: #f3f4f6;
          }

          /* Main text in suggestions */
          .pac-item-query {
            font-size: 15px;
            font-weight: 500;
            color: #1f2937;
          }

          /* Secondary text in suggestions */
          .pac-item > span:not(.pac-item-query) {
            color: #6b7280;
          }

          /* Matched text highlighting */
          .pac-matched {
            font-weight: 600;
            color: #2563eb;
          }

          /* Remove the Google Powered logo */
          .pac-logo:after {
            display: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <SearchBox />
      </div>

      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 38.736946, lng: -9.142685 }}
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapId="cc6289491cc9a804"
        onClick={handleMapClick}
        onZoomChanged={handleZoomChanged}
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
            scale={zoom > 12 ? 1.5 : 1}
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
              scale={zoom > 12 ? 1.3 : 0.8}
            />
            <InfoWindow
              position={poiInfo.position}
              onClose={handleInfoWindowClose}
            >
              <div className="w-72">
                <h3 className="font-bold text-lg text-gray-800">
                  {poiInfo.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 truncate">
                  {poiInfo.address}
                </p>
                {poiInfo.photoUrl && (
                  <div className="w-full h-36 mb-2 overflow-hidden rounded-lg">
                    <img
                      src={poiInfo.photoUrl}
                      alt={poiInfo.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  {poiInfo.website && (
                    <a
                      href={poiInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm hover:underline focus:outline-none"
                    >
                      Visit Website
                    </a>
                  )}
                  <button
                    onClick={() => alert("Button clicked!")}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition duration-200"
                  >
                    Custom Button
                  </button>
                </div>
              </div>
            </InfoWindow>
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
