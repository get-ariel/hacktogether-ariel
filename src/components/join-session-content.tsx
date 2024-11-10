"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJoinUrl } from "react-together";

export default function JoinSessionContent() {
  const [name, setName] = useState("");
  const router = useRouter();
  const joinUrl = useJoinUrl() || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
  };

  const joinSession = () => {
    router.push(
      `/dashboard${joinUrl.split("?")[1] ? `?${joinUrl.split("?")[1]}` : ""}`
    );
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
