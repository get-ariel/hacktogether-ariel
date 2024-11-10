"use client";

import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import dynamic from "next/dynamic";

export default function StartPlanningPage() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();

  const isFormFilled = Boolean(city && date?.from && date?.to);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ city, date });
  };

  const CreateRandomSessionButton = dynamic(
    () =>
      import("@/components/CreateRandomSessionButton").then(
        (mod) => mod.CreateRandomSessionButton
      ),
    { ssr: false }
  );

  return (
    <div className="container mx-auto p-8 max-w-xl">
      <h1 className="text-4xl font-bold mb-8">Plan Your Trip</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="city" className="block text-xl mb-4">
            Where are you going?
          </label>
          <Input
            id="city"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="text-lg h-12 px-4"
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
            />
          </div>
        </div>
        <CreateRandomSessionButton disabled={!isFormFilled} />
      </form>
    </div>
  );
}
