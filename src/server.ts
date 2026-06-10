import serverEntry from "@tanstack/react-start/server-entry";

import {
  createAdminAuthCookieHeader,
  createBasicAuthChallengeResponse,
  isBasicAuthAuthorized,
} from "@/utils/admin_auth";

type WorkerEnv = {
  ADMIN_PASSWORD?: string;
  ADMIN_USERNAME?: string;
};

type WorkerExecutionContext = unknown;
type WorkerServerFetch = (
  request: Request,
  env?: WorkerEnv,
  context?: WorkerExecutionContext,
) => Response | Promise<Response>;

export default {
  async fetch(request: Request, env: WorkerEnv, context: WorkerExecutionContext) {
    const url = new URL(request.url);
    let shouldRefreshAdminCookie = false;

    if (url.pathname === "/store/admin" || url.pathname.startsWith("/store/admin/")) {
      if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
        return new Response("Admin credentials are not configured.", { status: 500 });
      }

      if (
        !isBasicAuthAuthorized(
          request.headers.get("authorization"),
          env.ADMIN_USERNAME,
          env.ADMIN_PASSWORD,
        )
      ) {
        return createBasicAuthChallengeResponse();
      }

      shouldRefreshAdminCookie = true;
    }

    const response = await (serverEntry.fetch as WorkerServerFetch)(request, env, context);

    if (shouldRefreshAdminCookie && env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
      response.headers.append(
        "Set-Cookie",
        createAdminAuthCookieHeader(
          env.ADMIN_USERNAME,
          env.ADMIN_PASSWORD,
          url.protocol === "https:",
        ),
      );
    }

    return response;
  },
};
