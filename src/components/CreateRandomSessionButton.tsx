"use client";

import { useCreateRandomSession } from "react-together";
import { Button } from "./ui/button";
import { useState } from "react";
import { ShareSessionDialog } from "./ShareSessionDialog";

interface CreateRandomSessionButtonProps {
  disabled?: boolean;
}

export function CreateRandomSessionButton({
  disabled,
}: CreateRandomSessionButtonProps) {
  const createRandomSession = useCreateRandomSession();
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleClick = () => {
    createRandomSession();
    setShowShareDialog(true);
  };

  return (
    <>
      <Button
        type="submit"
        className={`w-full py-3 px-4 rounded-lg text-white text-lg font-medium
          ${disabled ? "bg-primary" : "bg-primary hover:bg-primary/90"}`}
        onClick={handleClick}
        disabled={disabled}
      >
        Start Planning
      </Button>

      <ShareSessionDialog
        isOpen={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </>
  );
}
