import { createServerFn } from "@tanstack/react-start";

import { isStoreEnabled } from "./store-config";

export const getStoreEnabled = createServerFn({ method: "GET" }).handler(async () => {
  return {
    isStoreEnabled: isStoreEnabled(),
  };
});
