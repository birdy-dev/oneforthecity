import { createFileRoute } from "@tanstack/react-router";

import { SuccessPage } from "@/features/store/success-page";

export const Route = createFileRoute("/store/success")({
  component: SuccessPage,
});
