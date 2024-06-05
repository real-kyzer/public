"use server";

import { db } from "@/db/db-connection";
import { eq } from "drizzle-orm";
import { entryTable } from "./schema";

export async function getEntry(uuid: string) {
  const res = await db
    .select()
    .from(entryTable)
    .where(eq(entryTable.uuid, uuid))
    .all();

  return res;
}
