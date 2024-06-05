import { entryTable } from "@/db/schema";

export const columnInitialVisibility: Record<
  keyof Omit<typeof entryTable.$inferSelect, "internalNotes"> | "actions",
  boolean
> = {
  uuid: false,
  type: false,
  description: true,
  createdOn: false,
  updatedOn: true,
  userId: false,
  actions: true,
};
