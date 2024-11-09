import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Users, Calendar, Share2 } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">TripSync</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Plan Your Dream Trip Together
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Collaborate in real-time, share favorite spots, and create the
                  perfect itinerary with your friends.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/start-planning">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    Start Planning Now
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose TripSync?
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <MapPin className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Interactive Map</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Visualize your trip with an interactive map where everyone can
                  add their favorite spots.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Real-time Collaboration</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Plan together in real-time, see each other&apos;s changes
                  instantly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Calendar className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Smart Scheduling</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Easily create and manage your trip schedule with our intuitive
                  tools.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Share2 className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold">Easy Sharing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Invite friends with a simple link and start planning together
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Your Adventure?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create a session now and invite your friends to plan your next
                  unforgettable trip together.
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
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By creating a session, you agree to our terms of service and
                  privacy policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TripSync. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
