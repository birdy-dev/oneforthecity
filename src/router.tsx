import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}
