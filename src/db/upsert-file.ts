"use server";

import { db } from "@/db/db-connection";
import { auth } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { filesTable } from "./schema";

export async function upsertFile(
  data: Omit<
    typeof filesTable.$inferSelect,
    "uuid" | "createdOn" | "updatedOn" | "userId"
  >,
) {
  if (!data || !data.entryUuid || !data.key || !data.size) {
    return {
      success: false,
      results: [],
      message:
        "Could not create entry, make sure all fields are correct and try again.",
    };
  }

  const session = await auth();
  if (!session || !session.user || !session.user.id)
    return {
      success: false,
      results: [],
      message: "Couldn't upload file, No user found",
    };

  try {
    const res = await db
      .insert(filesTable)
      .values({ ...data, userId: session.user!.id! })
      .onConflictDoUpdate({
        target: filesTable.key,
        set: { ...data, updatedOn: sql`CURRENT_TIMESTAMP` },
      })
      .returning()
      .get();

    return {
      success: true,
      results: [res],
      message: null,
    };
  } catch (error: any) {
    return {
      success: false,
      results: [],
      message: error.message,
    };
  }
}
