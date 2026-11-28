import { getRequest } from "@tanstack/react-start/server";

export const adminAuthRealm = "One for the City Store Admin";
const adminAuthCookieName = "oftc_store_admin_auth";
const adminAuthCookieMaxAgeSeconds = 60 * 60 * 12;

export function requireAdminAuth() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error("Admin credentials are not configured.");
  }

  const request = getRequest();

  if (
    !isBasicAuthAuthorized(request.headers.get("authorization"), username, password) &&
    !isAdminAuthCookieAuthorized(request.headers.get("cookie"), username, password)
  ) {
    throw new Error("Admin authentication required.");
  }
}

export function isBasicAuthAuthorized(
  authorization: string | null,
  username: string,
  password: string,
) {
  if (!authorization?.startsWith("Basic ")) {
    return false;
  }

  const decoded = decodeBasicAuth(authorization.slice("Basic ".length));

  if (!decoded) {
    return false;
  }

  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return false;
  }

  return (
    decoded.slice(0, separatorIndex) === username && decoded.slice(separatorIndex + 1) === password
  );
}

export function createBasicAuthChallengeResponse(message = "Authentication required.") {
  return new Response(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${adminAuthRealm}", charset="UTF-8"`,
    },
  });
}

export function createAdminAuthCookieHeader(username: string, password: string, secure: boolean) {
  const secureAttribute = secure ? "; Secure" : "";

  return [
    `${adminAuthCookieName}=${encodeURIComponent(createAdminAuthCookieValue(username, password))}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${adminAuthCookieMaxAgeSeconds}`,
    secureAttribute,
  ]
    .filter(Boolean)
    .join("; ");
}

export function isAdminAuthCookieAuthorized(
  cookieHeader: string | null,
  username: string,
  password: string,
) {
  return (
    parseCookie(cookieHeader, adminAuthCookieName) ===
    createAdminAuthCookieValue(username, password)
  );
}

function createAdminAuthCookieValue(username: string, password: string) {
  return btoa(`${username}:${password}`);
}

function parseCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const cookieName = cookie.slice(0, separatorIndex).trim();

    if (cookieName !== name) {
      continue;
    }

    try {
      return decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
    } catch {
      return null;
    }
  }

  return null;
}

function decodeBasicAuth(value: string) {
  try {
    return atob(value);
  } catch {
    return null;
  }
}
