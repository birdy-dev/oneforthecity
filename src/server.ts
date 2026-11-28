import serverEntry from "@tanstack/react-start/server-entry";

import {
  handleStoreAdminRequest,
  type StoreAdminEnv,
} from "@/features/store/store-admin-request.server";

type WorkerExecutionContext = unknown;
type WorkerServerFetch = (
  request: Request,
  env?: StoreAdminEnv,
  context?: WorkerExecutionContext,
) => Response | Promise<Response>;

export default {
  fetch(request: Request, env: StoreAdminEnv, context: WorkerExecutionContext) {
    return handleStoreAdminRequest(request, env, () =>
      (serverEntry.fetch as WorkerServerFetch)(request, env, context),
    );
  },
};
