import { Config, defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/db/schema.ts",
//   out: "./drizzle",
//   dialect: "",
//   driver: "d1-http",
//   dbCredentials: {
//     accountId:
//     wranglerConfigPath: "wrangler.toml",
//     dbName: "waste",
//   },
// }) satisfies Config;

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/0fd571cb625e1ffe65d1d5bb4da211a1b697b10751a6ebe21326f1bbde77b4fc.sqlite",
  },
});
