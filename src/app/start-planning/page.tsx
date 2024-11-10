"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import dynamic from "next/dynamic";

const CreateRandomSessionButton = dynamic(
  () =>
    import("@/components/CreateRandomSessionButton").then(
      (mod) => mod.CreateRandomSessionButton
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-12 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

interface TripDetails {
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
}

export default function StartPlanningPage() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google || !window.google.maps) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["(cities)"],
      fields: ["place_id", "formatted_address", "geometry"],
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setCity(place.formatted_address);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const isFormFilled = Boolean(city && date?.from && date?.to);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date?.from || !date?.to || !autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    const tripDetails: TripDetails = {
      city,
      coordinates: {
        lat: place.geometry?.location?.lat() || 0,
        lng: place.geometry?.location?.lng() || 0,
      },
      dateRange: {
        start: date.from.toISOString(),
        end: date.to.toISOString(),
      },
    };

    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  };

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <h1 className="text-4xl font-bold mb-8">Plan Your Trip</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="city" className="block text-xl mb-4">
            Where are you going?
          </label>
          <input
            ref={inputRef}
            type="text"
            id="city"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full h-12 px-4 rounded-md border border-input bg-background text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-xl mb-4">When are you travelling?</label>
          <div className="rounded-xl border shadow-sm">
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              defaultMonth={new Date(2024, 10)}
              className="p-4"
              classNames={{
                day_range_middle:
                  "bg-primary/50 text-[#121827] hover:bg-primary/60 rounded-none",
                day_selected:
                  "bg-primary text-white hover:bg-primary/90 rounded-md",
                day_range_end:
                  "bg-primary text-white hover:bg-primary/90 rounded-md",
                day_range_start:
                  "bg-primary text-white hover:bg-primary/90 rounded-md",
              }}
            />
          </div>
        </div>
        <CreateRandomSessionButton disabled={!isFormFilled} />
      </form>

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
