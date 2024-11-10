"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useJoinUrl } from "react-together";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ShareSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareSessionDialog({
  isOpen,
  onOpenChange,
}: ShareSessionDialogProps) {
  const joinUrl = useJoinUrl() || "";
  const router = useRouter();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      window.location.origin +
        `/join-session${
          joinUrl.split("?")[1] ? `?${joinUrl.split("?")[1]}` : ""
        }`
    );
    toast.success("Link copied to clipboard!");
  };

  const joinSession = () => {
    router.push(
      `/join-session${joinUrl.split("?")[1] ? `?${joinUrl.split("?")[1]}` : ""}`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-[#e56f5f]/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center text-[#121827]">
            Share Your Session
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          <p className="text-sm text-[#121827]/70 text-center">
            Share this link with your friends to plan together in real-time
          </p>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={
                window.location.origin +
                `/join-session${
                  joinUrl.split("?")[1] ? `?${joinUrl.split("?")[1]}` : ""
                }`
              }
              className="flex-1 bg-[#fffdf9ff] border-2 border-[#e56f5f]/20 focus-visible:ring-[#e56f5f]/30"
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="shrink-0 border-2 border-[#e56f5f]/20 hover:bg-[#e56f5f]/10 text-[#121827]"
            >
              Copy
            </Button>
          </div>
          <div className="flex justify-center pt-2">
            <Button
              onClick={joinSession}
              className="w-full bg-[#e56f5f] hover:bg-[#e56f5f]/90 text-white"
            >
              Join Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
