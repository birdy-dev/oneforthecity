import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/3329dc323528defaa567340dfdcf7a2d64b551b5c50e29c50cffd0196605f4e4.sqlite",
  },
});
