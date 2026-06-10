import { drizzle } from "drizzle-orm/d1";
import { env } from "cloudflare:workers";

import * as schema from "./schema";

type CloudflareBindings = {
  DB?: D1Database;
};

export function getDb() {
  const db = (env as CloudflareBindings).DB;

  if (!db) {
    throw new Error("Missing DB D1 binding.");
  }

  return drizzle(db, { schema });
}

export type StoreDb = ReturnType<typeof getDb>;
