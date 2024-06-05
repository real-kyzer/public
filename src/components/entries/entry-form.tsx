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
import { createEntry } from "@/db/create-entry";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  description: z.string().min(3),
  internalNotes: z.union([z.string().optional(), z.literal("")]),
});

type Props = {
  type: string;
};

export function EntryForm({ type }: Props) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const response = await createEntry({
        type: type,
        description: data.description,
        internalNotes: data.internalNotes ?? null,
      });

      console.log("🚀 ~ startTransition ~ response:", response);
      toast.message(response.type, { description: response.message });
      router.push(`/${type}/${response.results[0].uuid}`);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="internalNotes"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Internal Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="internalNotes" rows={5} />
                </FormControl>
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
            Creating...
          </Button>
        ) : (
          <Button
            className="link-clip rounded-none bg-primary p-6 text-lg font-medium hover:bg-secondary hover:text-primary"
            type="submit"
          >
            Create
          </Button>
        )}
      </form>
    </Form>
  );
}
