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
import { string } from "zod";
import { FileUploadForm } from "./file-upload-form";

type Props = {
  type: string;
  uuid: string;
};

export function FileAddButton({ type, uuid }: Props) {
  const [open, setOpen] = useState(false);

  function onSuccess(): void {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="link-clip flex gap-2 rounded-none bg-primary p-6 text-lg font-medium hover:bg-secondary hover:text-primary ">
          Add File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-prose">
        <DialogHeader>
          <DialogTitle>Add file</DialogTitle>
          <DialogDescription>
            {"To add a new file, fill out the below for and click save."}
          </DialogDescription>
        </DialogHeader>
        <FileUploadForm type={type} uuid={uuid} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
