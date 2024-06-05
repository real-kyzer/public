"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { EntryForm } from "./entry-form";

type Props = {
  type: string;
};

export function EntryAddButton({ type }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="link-clip flex gap-2 rounded-none bg-primary p-6 text-lg font-medium hover:bg-secondary hover:text-primary">
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-prose">
        <DialogHeader>
          <DialogTitle>Add entry</DialogTitle>
          <DialogDescription>
            {"To add a new entry, fill out the below for and click save."}
          </DialogDescription>
        </DialogHeader>
        <EntryForm type={type} />
      </DialogContent>
    </Dialog>
  );
}
