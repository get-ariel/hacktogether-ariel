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

  const [poiMarkerRef, poiMarker] = useAdvancedMarkerRef(); // Added reference for POI marker

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

  const fetchPlaceDetails = useCallback(
    (placeId: string, latLng: google.maps.LatLngLiteral) => {
      setPoiInfo(null);
      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setPoiInfo({
            position: latLng,
            name: place.name || "Unknown Place",
            address: place.formatted_address || "No address available",
            website: place.website,
            photoUrl: place.photos?.[0]?.getUrl() || null,
          });
        }
      });
    },
    []
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      const { detail } = e;
      if (detail.placeId && detail.latLng) {
        e.stop();
        fetchPlaceDetails(detail.placeId, {
          lat:
            detail.latLng instanceof google.maps.LatLng
              ? detail.latLng.lat()
              : detail.latLng.lat,
          lng:
            detail.latLng instanceof google.maps.LatLng
              ? detail.latLng.lng()
              : detail.latLng.lng,
        });
      } else {
        setPoiInfo(null);
      }
    },
    [fetchPlaceDetails]
  );

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
          fields: ["geometry", "name", "formatted_address", "place_id"],
        }
      );
      autocompleteRef.current = autocomplete;

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;
        if (map) {
          const latLng = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          map.panTo(latLng);
          map.setZoom(15);
          if (place.place_id) {
            fetchPlaceDetails(place.place_id, latLng);
          }
        }
      });

      return () => {
        // Clean up listener
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }, [map, fetchPlaceDetails]);

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
          .pac-container {
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: system-ui, -apple-system, sans-serif;
            margin-top: 4px;
          }
          .pac-item {
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
          }
          .pac-item:hover {
            background-color: #f3f4f6;
          }
          .pac-item-selected {
            background-color: #e5e7eb;
          }
          .pac-icon {
            margin-right: 12px;
          }
          .pac-item-query {
            font-size: 14px;
            color: #1f2937;
          }
          .pac-matched {
            font-weight: 600;
          }
          .pac-secondary-text {
            color: #6b7280;
            font-size: 13px;
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

        {/* Initial Marker */}
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

        {/* POI Marker and InfoWindow */}
        {poiInfo && (
          <>
            <AdvancedMarker position={poiInfo.position} ref={poiMarkerRef}>
              <Pin
                background="#FF0000"
                borderColor="#B20000"
                glyphColor="#FFFFFF"
                scale={zoom > 12 ? 1.3 : 0.8}
              />
            </AdvancedMarker>
            <InfoWindow anchor={poiMarker} onClose={handleInfoWindowClose}>
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
          </>
        )}
      </Map>
    </APIProvider>
  );
}
