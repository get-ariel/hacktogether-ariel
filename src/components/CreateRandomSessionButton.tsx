"use client";

import { useCreateRandomSession } from "react-together";
import { Button } from "./ui/button";

export function CreateRandomSessionButton() {
  const createRandomSession = useCreateRandomSession();
  return <Button onClick={createRandomSession}>Create Random Session</Button>;
}
