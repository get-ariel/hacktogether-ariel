'use client'

import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Share2, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

interface TripMember {
  name: string;
  color: string;
}

interface Location {
  name: string;
  address: string;
  image: string;
}

export default function DashboardPage() {
  // Mock data
  const tripMembers: TripMember[] = [
    { name: "Ana Sofia", color: "#FFD700" },
    { name: "Bruno Sena", color: "#FF6B6B" },
    { name: "João Pedro (You)", color: "#4CAF50" },
  ];

  const locations: Location[] = [
    {
      name: "Madison Square",
      address: "Avenue 13, St avenue",
      image: "https://welcome-to-times-square.com/wp-content/uploads/2024/03/madison-square-garden-newyorkbyrail-com_89_0_867_539.webp"
    },
    {
      name: "Empire State Building",
      address: "Avenue 165th, St et 3",
      image: "https://lh3.googleusercontent.com/p/AF1QipOXaWSrMF4ixVBuqVK_n3-9lMKS0OSGdkDEN0Db=s1360-w1360-h1020"
    }
  ];

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
            {tripMembers.map((member, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: member.color }}
                />
                <span className="text-sm">{member.name}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full">
            <Share2 className="mr-2 h-4 w-4" />
            Share Trip
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Map Placeholder */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">Map goes here</span>
        </div>

        {/* Right Sidebar */}
        <aside className="w-96 border-l flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">April 11</h2>
              <p className="text-sm text-foreground/60">Friday</p>
            </div>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-4">
            {locations.map((location, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-all">
                <img
                  src={location.image}
                  alt={location.name}
                  className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900/80 to-transparent">
                  <h3 className="text-white font-semibold">{location.name}</h3>
                  <p className="text-white/80 text-sm">{location.address}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
} 