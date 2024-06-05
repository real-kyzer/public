"use server";

import { auth } from "@/lib/auth";

export async function User() {
  const session = await auth();
  return <h1>{session?.user?.name}</h1>;
}
