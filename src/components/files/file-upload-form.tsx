"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getPresignedUrl } from "@/db/get-presigned-url";
import { upsertFile } from "@/db/upsert-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpg",
  "image/jpeg",
];
const MAX_IMAGE_SIZE = 100; //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const formSchema = z.object({
  // planId: z.string().min(3),
  // description: z.string().min(3),
  // internalNotes: z.union([z.string().optional(), z.literal("")]),
  file: z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).length !== 0;
    }, "File is required")
    .refine((files) => {
      return Array.from(files ?? []).every(
        (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE,
      );
    }, `The maximum file size is ${MAX_IMAGE_SIZE}MB`)
    .refine((files) => {
      return Array.from(files ?? []).every((file) =>
        ACCEPTED_FILE_TYPES.includes(file.type),
      );
    }, "File type is not supported"),
});

type Props = {
  type: string;
  uuid: string;
  onSuccess: () => void;
};

export function FileUploadForm({ type, uuid, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const fileRef = form.register("file");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("category", type);
      formData.append("uuid", uuid);
      formData.append("file", data.file[0]);
      const presignedResponse = await getPresignedUrl(formData);
      toast.message("Success", { description: "Signed url generated" });

      try {
        const uploadResponse = await fetch(presignedResponse.url, {
          method: presignedResponse.method,
          headers: presignedResponse.headers,
          body: data.file[0],
        });
        if (!uploadResponse.ok) {
          throw new Error("Error");
        }
        const upsertResponse = await upsertFile({
          entryUuid: uuid,
          key: presignedResponse.key,
          size: data.file[0].size,
        });

        toast.message("Success", {
          description: `File has been succesfully uploaded.`,
        });
        router.refresh();
        onSuccess();
      } catch (error) {
        toast.message("Error", {
          description: `Something has gone wrong, please try again.`,
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-lg">File</FormLabel>
                <FormControl>
                  <Input
                    {...fileRef}
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        toast.message(`File sanatized`, {
                          description: `File name will be changed to '${e.target.files[0].name
                            .replace(/[^a-z0-9.\-]/gi, "-")
                            .replace(/(-)\1+/gi, "-")
                            .toLowerCase()}' when uploaded`,
                        });
                      }
                      fileRef.onChange(e);
                    }}
                  />
                </FormControl>
                <ul className="text-sm">
                  <li>
                    File names will be converted to lowercase and non
                    alphanumeric characters replaced by a
                    &quot;&#8288;-&#8288;&quot; character.
                  </li>
                  <li>{MAX_IMAGE_SIZE}MB limit.</li>
                  <li>
                    Allowed types:{" "}
                    {ACCEPTED_FILE_TYPES.map(
                      (filetype) => filetype.split("/").reverse()[0],
                    ).join(", ")}
                  </li>
                </ul>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {isPending ? (
          <Button
            disabled
            className="link-clip rounded-none bg-primary p-6 text-lg font-medium hover:bg-secondary hover:text-primary"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </Button>
        ) : (
          <Button
            className="link-clip rounded-none bg-primary p-6 text-lg font-medium hover:bg-secondary hover:text-primary"
            type="submit"
          >
            Upload
          </Button>
        )}
      </form>
    </Form>
  );
}
