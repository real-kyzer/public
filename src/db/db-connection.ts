import { getRequestContext } from "@cloudflare/next-on-pages";
import { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import { Logger } from "drizzle-orm/logger";

// class QueryLogger implements Logger {
//   logQuery(query: string, params: unknown[]): void {
//     console.debug("___QUERY___");
//     console.debug(query);
//     console.debug(params);
//     console.debug("___END_QUERY___");
//   }
// }

// const client = (process.env as unknown as { DB: D1Database }).DB;

// export const db = drizzle(client, { logger: new QueryLogger() });

// export const db = drizzle((process.env as unknown as { DB: D1Database }).DB);
// export const db = drizzle(getRequestContext().env.DB);

export const db = drizzle(
  process.env.NODE_ENV === "development"
    ? getRequestContext().env.DB
    : (process.env as unknown as CloudflareEnv).DB,
);
