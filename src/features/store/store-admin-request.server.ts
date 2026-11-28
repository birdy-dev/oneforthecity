import {
  createAdminAuthCookieHeader,
  createBasicAuthChallengeResponse,
  isBasicAuthAuthorized,
} from "./admin-auth";

export type StoreAdminEnv = {
  ADMIN_PASSWORD?: string;
  ADMIN_USERNAME?: string;
};

export async function handleStoreAdminRequest(
  request: Request,
  env: StoreAdminEnv,
  next: () => Response | Promise<Response>,
) {
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

  const response = await next();

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
}
