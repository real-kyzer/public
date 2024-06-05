"use server";

import { db } from "@/db/db-connection";
import { eq } from "drizzle-orm";
import { filesTable } from "./schema";

export async function getFilesByEntry(entryUuid: string) {
  const res = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.entryUuid, entryUuid))
    .all();

  return res;
}
