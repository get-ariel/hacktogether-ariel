"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinUrl } from "react-together";

export default function JoinSessionContent() {
  const [name, setName] = useState("");
  const router = useRouter();
  const joinUrl = useJoinUrl() || "";

  const getQueryParams = () => {
    if (joinUrl) return joinUrl.split("?")[1];
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const hash = window.location.hash;
      return `${search.slice(1)}${hash}`.replace("#", "&");
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    joinSession();
  };

  const joinSession = () => {
    const queryParams = getQueryParams();
    router.push(`/dashboard${queryParams ? `?${queryParams}` : ""}`);
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-[#121827]">
        Join Session
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full"
          required
        />
        <Button
          type="submit"
          onClick={joinSession}
          className="w-full bg-[#e56f5f] hover:bg-[#e56f5f]/90 text-white"
        >
          Join
        </Button>
      </form>
    </div>
  );
}
