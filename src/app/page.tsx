'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Floating Icons Background - Updated positions and opacity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[15%] left-[5%]"
          animate={{ 
            y: [0, 20, 0], 
            x: [0, 10, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <MapPin className="h-16 w-16 text-primary/10" />
        </motion.div>
        <motion.div 
          className="absolute top-[20%] right-[10%]"
          animate={{ 
            y: [0, -15, 0],
            x: [0, -10, 0],
            rotate: [0, -5, 0] 
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Calendar className="h-20 w-20 text-primary/5" />
        </motion.div>
        <motion.div 
          className="absolute bottom-[30%] left-[15%]"
          animate={{ 
            y: [0, 10, 0],
            x: [0, 5, 0],
            rotate: [0, 3, 0] 
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Share2 className="h-12 w-12 text-primary/8" />
        </motion.div>
      </div>

      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center relative z-10">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">TripSync</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Features</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">About</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">Contact</Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center gap-2 bg-foreground/5 px-4 py-2 rounded-full mb-8">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium">Real-time Trip Planning</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-center max-w-4xl leading-tight">
                Plan Your Next Adventure
                <span className="text-primary block">Together</span>
              </h1>
              
              <p className="mx-auto max-w-[700px] text-foreground/60 md:text-xl">
                Collaborate in real-time, share favorite spots, and create the perfect itinerary with your friends.
              </p>

              <div className="flex gap-4 mt-8">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  Start Planning Now
                </Button>
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Updated design */}
        <section className="w-full py-24 lg:py-32 bg-foreground/[0.02]">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Why Choose TripSync?
            </h2>
            <p className="text-xl text-foreground/60 text-center mb-16 max-w-3xl mx-auto">
              Everything you need to plan the perfect trip with friends
            </p>
            
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                <p className="text-foreground/60">
                  Visualize your trip with an interactive map where everyone can add their favorite spots.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Collaboration</h3>
                <p className="text-foreground/60">
                  Plan together in real-time, see each other's changes instantly.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
                <p className="text-foreground/60">
                  Easily create and manage your trip schedule with our intuitive tools.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="mb-6 p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <Share2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Sharing</h3>
                <p className="text-foreground/60">
                  Invite friends with a simple link and start planning together immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Your Adventure?
                </h2>
                <p className="mx-auto max-w-[600px] text-foreground/60 md:text-xl">
                  Create a session now and invite your friends to plan your next unforgettable trip together.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Create Session</Button>
                </form>
                <p className="text-xs text-foreground/60">
                  By creating a session, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">
          © 2024 TripSync. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">Terms of Service</Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
