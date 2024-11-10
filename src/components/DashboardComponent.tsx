"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Calendar as CalendarIcon,
  FileText,
  Share2,
  Download,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
  Pencil,
  Check,
} from "lucide-react";
import Link from "next/link";
import { format, addDays, subDays } from "date-fns";
import { useState, useRef } from "react";
import { MapComponent } from "@/components/MapComponent";
import {
  useStateTogether,
  useStateTogetherWithPerUserValues,
} from "react-together";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TripLocation {
  id: string;
  name: string;
  address: string;
  image: string;
  date: string;
  order: number;
  website: string;
}

// Mock trip members instead of using useConnectedUsers
const MOCK_USERS = [
  { userId: "1", name: "Ana Sofia", isYou: false },
  { userId: "2", name: "Bruno Sena", isYou: false },
  { userId: "3", name: "João Pedro", isYou: true },
];

// Add this new component for the date range selector
function DateRangeSelector({
  tripDates,
  handleDateChange,
}: {
  tripDates: { start: string; end: string };
  handleDateChange: (dates: { start?: string; end?: string }) => void;
}) {
  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (tripDates.end && date > new Date(tripDates.end)) {
      // If start date is after end date, set end date to the next day
      const nextDay = addDays(date, 1);
      handleDateChange({
        start: format(date, "yyyy-MM-dd"),
        end: format(nextDay, "yyyy-MM-dd"),
      });
    } else {
      handleDateChange({ start: format(date, "yyyy-MM-dd") });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (tripDates.start && date < new Date(tripDates.start)) {
      // If end date is before start date, set start date to the previous day
      const previousDay = subDays(date, 1);
      handleDateChange({
        start: format(previousDay, "yyyy-MM-dd"),
        end: format(date, "yyyy-MM-dd"),
      });
    } else {
      handleDateChange({ end: format(date, "yyyy-MM-dd") });
    }
  };

  return (
    <div className="flex items-center gap-3 bg-primary/5 p-2 rounded-lg border border-primary/10">
      <div className="flex flex-col">
        <span className="text-xs text-foreground/60 font-medium">From</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-2 w-[140px] text-sm font-medium justify-start text-left border-0 focus:ring-0 hover:bg-primary/10",
                !tripDates.start && "text-muted-foreground"
              )}
            >
              {tripDates.start
                ? format(new Date(tripDates.start), "MMM dd, yyyy")
                : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-background border shadow-md"
            align="start"
          >
            <Calendar
              mode="single"
              selected={new Date(tripDates.start)}
              onSelect={handleStartDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="h-8 flex items-center">
        <div className="w-4 h-[2px] bg-foreground/20 rounded-full" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-foreground/60 font-medium">To</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-8 px-2 w-[140px] text-sm font-medium justify-start text-left border-0 focus:ring-0 hover:bg-primary/10",
                !tripDates.end && "text-muted-foreground"
              )}
            >
              {tripDates.end
                ? format(new Date(tripDates.end), "MMM dd, yyyy")
                : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-background border shadow-md"
            align="start"
          >
            <Calendar
              mode="single"
              selected={new Date(tripDates.end)}
              onSelect={handleEndDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function DashboardComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date("2024-04-11")
  );
  const [tripDates, setTripDates] = useStateTogether<{
    start: string;
    end: string;
  }>("trip-dates", {
    start: "2024-04-11",
    end: "2024-04-25",
  });
  const [locations, setLocations] = useStateTogether<TripLocation[]>(
    "trip-locations",
    []
  );
  const myId = "3"; // Mock user ID
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tripTitle, setTripTitle] = useStateTogether<string>(
    "trip-title",
    "US power trip 2025 🇺🇸"
  );
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [likes, setLikes, likesPerUser] = useStateTogetherWithPerUserValues<
    string[]
  >(
    "location-likes",
    [] // Initial empty array of location IDs that the user likes
  );

  const handleLike = (locationId: string) => {
    setLikes((prevLikes) => {
      if (prevLikes.includes(locationId)) {
        return prevLikes.filter((id) => id !== locationId);
      }
      return [...prevLikes, locationId];
    });
  };

  const getLikesCount = (locationId: string) => {
    return Object.values(likesPerUser).reduce(
      (count, userLikes) => count + (userLikes.includes(locationId) ? 1 : 0),
      0
    );
  };

  const hasUserLiked = (locationId: string) => {
    return likes.includes(locationId);
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pendingDateChange, setPendingDateChange] = useState<{
    start?: string;
    end?: string;
  } | null>(null);

  const getLocationsOutsideRange = (start: string, end: string) => {
    return locations.filter((loc) => {
      return loc.date < start || loc.date > end;
    });
  };

  const handleDateChange = (newDates: { start?: string; end?: string }) => {
    const proposedDates = {
      start: newDates.start ?? tripDates.start,
      end: newDates.end ?? tripDates.end,
    };

    const affectedLocations = getLocationsOutsideRange(
      proposedDates.start,
      proposedDates.end
    );

    if (affectedLocations.length > 0) {
      setPendingDateChange(proposedDates);
      setShowDeleteConfirmation(true);
    } else {
      setTripDates(proposedDates);
      // Update selected date if it falls outside the new range
      const currentSelected = selectedDate;
      const newStart = new Date(proposedDates.start);
      const newEnd = new Date(proposedDates.end);

      if (currentSelected < newStart) {
        setSelectedDate(newStart);
      } else if (currentSelected > newEnd) {
        setSelectedDate(newEnd);
      }
    }
  };

  const confirmDateChange = () => {
    if (pendingDateChange) {
      setTripDates({
        start: pendingDateChange.start ?? tripDates.start,
        end: pendingDateChange.end ?? tripDates.end,
      });
      // Remove locations outside the new date range
      const remainingLocations = locations.filter(
        (loc) =>
          loc.date >= pendingDateChange.start! &&
          loc.date <= pendingDateChange.end!
      );
      setLocations(remainingLocations);

      // Update selected date if needed
      const newStart = new Date(pendingDateChange.start!);
      const newEnd = new Date(pendingDateChange.end!);
      if (selectedDate < newStart) {
        setSelectedDate(newStart);
      } else if (selectedDate > newEnd) {
        setSelectedDate(newEnd);
      }
    }
    setShowDeleteConfirmation(false);
    setPendingDateChange(null);
  };

  const filteredLocations =
    locations
      ?.filter((loc) => loc.date === format(selectedDate, "yyyy-MM-dd"))
      .sort((a, b) => a.order - b.order) ?? [];

  // Generate random color for each user
  const getUserColor = (userId: string) => {
    const colors = ["#FFD700", "#FF6B6B", "#4CAF50", "#2196F3", "#9C27B0"];
    const index = parseInt(userId.slice(-3), 16) % colors.length;
    return colors[index];
  };

  const handleRemove = (locationId: string) => {
    setLocations(locations.filter((loc) => loc.id !== locationId));
  };

  const handleReorder = (locationId: string, direction: "up" | "down") => {
    const currentDate = format(selectedDate, "yyyy-MM-dd");

    setLocations((prevLocations) => {
      // Get locations for current date and others
      const dateLocations = [
        ...prevLocations.filter((loc) => loc.date === currentDate),
      ];
      const otherLocations = prevLocations.filter(
        (loc) => loc.date !== currentDate
      );

      // Find current location index
      const currentIndex = dateLocations.findIndex(
        (loc) => loc.id === locationId
      );
      const swapIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      // Check if move is possible
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === dateLocations.length - 1)
      ) {
        return prevLocations;
      }

      // Swap locations
      [dateLocations[currentIndex], dateLocations[swapIndex]] = [
        dateLocations[swapIndex],
        dateLocations[currentIndex],
      ];

      // Update order numbers sequentially
      dateLocations.forEach((loc, index) => {
        loc.order = index;
      });

      // Return updated locations
      return [...otherLocations, ...dateLocations];
    });
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    // Focus the input after render
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave();
    }
    if (e.key === "Escape") {
      setIsEditingTitle(false);
    }
  };

  // Add this helper function to generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Update the MapComponent handler
  const handleSavePoi = (poi: any) => {
    const newLocation: TripLocation = {
      id: generateId(),
      name: poi.name || "New Location",
      address: poi.address || "",
      image: poi.photoUrl || "https://place-hold.it/800x600",
      date: format(selectedDate, "yyyy-MM-dd"),
      order: locations.length,
      website: poi.website || "",
    };

    setLocations([...locations, newLocation]);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r flex flex-col">
        <div className="h-[88px] flex items-center px-6 border-b">
          <Link href="/" className="flex items-center">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">
              TripSync
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Planner
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Trip Notes
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </nav>

        <div className="p-4 border-t">
          <h3 className="text-sm font-semibold mb-3">Your Trip Group</h3>
          <div className="space-y-2 mb-4">
            {MOCK_USERS.map((user) => (
              <div key={user.userId} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: getUserColor(user.userId) }}
                />
                <span className="text-sm">
                  {user.isYou ? `${user.name} (You)` : user.name}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Trip
          </Button>
        </div>
      </aside>

      {/* Main Content with Top Bar */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-[88px] border-b px-6 flex items-center justify-between bg-background">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    ref={titleInputRef}
                    value={tripTitle}
                    onChange={(e) => setTripTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-4xl font-bold h-auto py-1 w-[400px] bg-primary/5 border-primary/20 focus:border-primary/30"
                  />
                  <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold flex items-center gap-2 text-foreground/90 hover:text-foreground transition-colors group">
                    {tripTitle}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={handleTitleEdit}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </h1>
                  <p className="text-sm text-foreground/60">
                    Your travel plan at a glance
                  </p>
                </div>
              )}
            </div>
          </div>
          <DateRangeSelector
            tripDates={tripDates}
            handleDateChange={handleDateChange}
          />
        </div>

        {/* Map and Sidebar Container */}
        <main className="flex-1 flex overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 relative">
            <div className="absolute inset-0">
              <MapComponent onSavePoi={handleSavePoi} />
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-96 border-l flex flex-col bg-background">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newDate = subDays(selectedDate, 1);
                    setSelectedDate(newDate);
                  }}
                  disabled={selectedDate <= new Date(tripDates.start)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">
                    {format(selectedDate, "MMMM d")}
                  </h2>
                  <p className="text-sm text-foreground/60">
                    {format(selectedDate, "EEEE")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newDate = addDays(selectedDate, 1);
                    setSelectedDate(newDate);
                  }}
                  disabled={selectedDate >= new Date(tripDates.end)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {filteredLocations.map((location, index) => (
                <div
                  key={location.id}
                  className="relative overflow-hidden rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all"
                >
                  <img
                    src={location.image}
                    alt={location.name}
                    className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {location.name}
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      {location.address}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-primary hover:bg-white/10"
                          onClick={() => handleLike(location.id)}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 ${
                              hasUserLiked(location.id) ? "fill-primary" : ""
                            }`}
                          />
                          <span className="ml-2">
                            {getLikesCount(location.id)}
                          </span>
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-primary hover:bg-white/10"
                            onClick={() => handleReorder(location.id, "up")}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-primary hover:bg-white/10"
                            onClick={() => handleReorder(location.id, "down")}
                            disabled={index === filteredLocations.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {location.website ? (
                          <a
                            href={location.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-primary hover:bg-white/10"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-destructive hover:bg-white/10"
                          onClick={() => handleRemove(location.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </main>
      </div>
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">Confirm Date Change</h2>
            <p className="text-muted-foreground mb-4">
              Changing these dates will remove{" "}
              {
                getLocationsOutsideRange(
                  pendingDateChange?.start ?? tripDates.start,
                  pendingDateChange?.end ?? tripDates.end
                ).length
              }{" "}
              locations that fall outside the new date range. Are you sure you
              want to continue?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setPendingDateChange(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={confirmDateChange}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
