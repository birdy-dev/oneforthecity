import { createServerFn } from "@tanstack/react-start";

import { isStoreEnabled } from "./store_config";

export const getStoreEnabled = createServerFn({ method: "GET" }).handler(async () => {
  return {
    isStoreEnabled: isStoreEnabled(),
  };
});
