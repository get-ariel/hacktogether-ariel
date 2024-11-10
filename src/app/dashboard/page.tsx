'use client'

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Share2, Download, ChevronRight, ChevronLeft, ThumbsUp, ExternalLink, ChevronUp, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { format, addDays, subDays } from "date-fns";
import { useState } from "react";

interface TripLocation {
  id: string;
  name: string;
  address: string;
  image: string;
  likes: string[]; // array of user IDs who liked
  date: string; // ISO string
  order: number;
}

const INITIAL_LOCATIONS: TripLocation[] = [
  {
    id: "1",
    name: "Madison Square",
    address: "Avenue 13, St avenue",
    image: "https://welcome-to-times-square.com/wp-content/uploads/2024/03/madison-square-garden-newyorkbyrail-com_89_0_867_539.webp",
    likes: [],
    date: "2024-04-11",
    order: 0
  },
  {
    id: "2",
    name: "Empire State Building",
    address: "Avenue 165th, St et 3",
    image: "https://lh3.googleusercontent.com/p/AF1QipOXaWSrMF4ixVBuqVK_n3-9lMKS0OSGdkDEN0Db=s1360-w1360-h1020",
    likes: [],
    date: "2024-04-11",
    order: 1
  }
];

// Mock trip members instead of using useConnectedUsers
const MOCK_USERS = [
  { userId: "1", name: "Ana Sofia", isYou: false },
  { userId: "2", name: "Bruno Sena", isYou: false },
  { userId: "3", name: "João Pedro", isYou: true }
];

function DashboardContent() {
  const [selectedDate, setSelectedDate] = useState(new Date("2024-04-11"));
  const [locations, setLocations] = useState<TripLocation[]>(INITIAL_LOCATIONS);
  const myId = "3"; // Mock user ID

  const handleLike = (locationId: string) => {
    setLocations(locations.map(loc => {
      if (loc.id === locationId) {
        const likes = loc.likes.includes(myId) 
          ? loc.likes.filter(id => id !== myId)
          : [...loc.likes, myId];
        return { ...loc, likes };
      }
      return loc;
    }));
  };

  const handleDateChange = (direction: 'next' | 'prev') => {
    setSelectedDate(current => 
      direction === 'next' ? addDays(current, 1) : subDays(current, 1)
    );
  };

  const filteredLocations = locations
    ?.filter(loc => loc.date === format(selectedDate, 'yyyy-MM-dd'))
    .sort((a, b) => a.order - b.order) ?? [];

  // Generate random color for each user
  const getUserColor = (userId: string) => {
    const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#2196F3', '#9C27B0'];
    const index = parseInt(userId.slice(-3), 16) % colors.length;
    return colors[index];
  };

  const handleRemove = (locationId: string) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
  };

  const handleReorder = (locationId: string, direction: 'up' | 'down') => {
    const currentDate = format(selectedDate, 'yyyy-MM-dd');
    
    setLocations(prevLocations => {
      // Get locations for current date and others
      const dateLocations = [...prevLocations.filter(loc => loc.date === currentDate)];
      const otherLocations = prevLocations.filter(loc => loc.date !== currentDate);
      
      // Find current location index
      const currentIndex = dateLocations.findIndex(loc => loc.id === locationId);
      const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Check if move is possible
      if (
        (direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === dateLocations.length - 1)
      ) {
        return prevLocations;
      }
      
      // Swap locations
      [dateLocations[currentIndex], dateLocations[swapIndex]] = 
        [dateLocations[swapIndex], dateLocations[currentIndex]];
      
      // Update order numbers sequentially
      dateLocations.forEach((loc, index) => {
        loc.order = index;
      });
      
      // Return updated locations
      return [...otherLocations, ...dateLocations];
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center">
            <MapPin className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">TripSync</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <MapPin className="mr-2 h-4 w-4" />
            Planner
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
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
        <div className="border-b p-4 flex items-center justify-between bg-background">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              US power trip 2025 <span className="text-xl">🇺🇸</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              April 11, 2025 - April 25, 2025
            </p>
          </div>
        </div>

        {/* Map and Sidebar Container */}
        <main className="flex-1 flex">
          {/* Map Placeholder */}
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">Map goes here</span>
          </div>

          {/* Right Sidebar */}
          <aside className="w-96 border-l flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => handleDateChange('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <h2 className="text-2xl font-bold">{format(selectedDate, 'MMMM d')}</h2>
                <p className="text-sm text-foreground/60">{format(selectedDate, 'EEEE')}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDateChange('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {filteredLocations.map((location, index) => (
                <div key={location.id} className="relative overflow-hidden rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{location.name}</h3>
                    <p className="text-white/90 text-sm mb-3">{location.address}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white hover:text-primary hover:bg-white/10"
                          onClick={() => handleLike(location.id)}
                        >
                          <ThumbsUp className={`h-4 w-4 ${myId && location.likes.includes(myId) ? 'fill-primary' : ''}`} />
                          <span className="ml-2">{location.likes.length}</span>
                        </Button>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white hover:text-primary hover:bg-white/10"
                            onClick={() => handleReorder(location.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-white hover:text-primary hover:bg-white/10"
                            onClick={() => handleReorder(location.id, 'down')}
                            disabled={index === filteredLocations.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.name} ${location.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm" className="text-white hover:text-primary hover:bg-white/10">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </a>
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
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
} 