"use server";

import { db } from "@/db/db-connection";
import { eq } from "drizzle-orm";
import { entryTable } from "./schema";

export async function getEntriesByType(type: string) {
  const res = await db
    .select()
    .from(entryTable)
    .where(eq(entryTable.type, type))
    .all();

  return res;
}
