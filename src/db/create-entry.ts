"use server";

import { db } from "@/db/db-connection";
import { auth } from "@/lib/auth";
import { entryTable } from "./schema";

export async function createEntry(
  data: Omit<
    typeof entryTable.$inferSelect,
    "uuid" | "createdOn" | "updatedOn" | "userId"
  >,
) {
  console.log("🚀 ~ data:", data)
  if (!data || !data.type || !data.description) {
    return {
      type: "Error",
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
      .insert(entryTable)
      .values({ ...data, userId: session.user!.id! })
      .returning()
      .get();

    return {
      type: "Success",
      results: [res],
      message: `${res.description} has been succesfully created.`,
    };
  } catch (error: any) {
    return {
      type: "Error",
      results: [],
      message: error.message,
    };
  }
}
