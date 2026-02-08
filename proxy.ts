import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutesInfo } from "./src/constants/protectedRoutes";
import { getApiUrl } from "@utils/getServerUrl";

/* =========================
   1) Твоя текущая логика protected routes
   ========================= */

const protectedRoutes = Object.keys(protectedRoutesInfo).sort();

const isProtected = (route: string): boolean => {
  let left = 0;
  let right = protectedRoutes.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (protectedRoutes[mid] === route) return true;
    if (route < protectedRoutes[mid]) right = mid - 1;
    else left = mid + 1;
  }

  return false;
};

const PUBLIC_FILE = /\.(.*)$/;
const SPEC = /\/[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/;

const removeSpec = (pathname: string): [string, string?] => {
  let spec = undefined;
  let path = pathname;

  if (SPEC.test(pathname.toLowerCase())) {
    path = pathname.slice(0, pathname.lastIndexOf("/"));
    spec = pathname.slice(pathname.lastIndexOf("/") + 1);
  }

  return [path, spec];
};

/* =========================
   2) Новая ветка для course путей
   ========================= */

// Любой путь, где есть сегмент /course
const COURSE_SEGMENT = /(^|\/)course(\/|$)/;

/* =========================
   3) JWT helpers (exp проверка)
   ========================= */

function base64UrlToUtf8(input: string) {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64);
}

function readJwtExpSeconds(token: string): number | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payloadJson = base64UrlToUtf8(parts[1]);
    const payload = JSON.parse(payloadJson) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/* =========================
   4) Refresh helpers
   ========================= */

function toValidDate(v: unknown): Date {
  const d =
    typeof v === "number"
      ? new Date(v)
      : typeof v === "string" && /^\d+$/.test(v)
        ? new Date(Number(v))
        : typeof v === "string"
          ? new Date(v)
          : v instanceof Date
            ? v
            : new Date(NaN);

  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid expires value: ${String(v)}`);
  }

  return d;
}

function upsertCookieHeader(cookieHeader: string, name: string, value: string) {
  const entries = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const map = new Map<string, string>();
  for (const e of entries) {
    const idx = e.indexOf("=");
    if (idx === -1) continue;
    const k = e.slice(0, idx).trim();
    const v = e.slice(idx + 1);
    map.set(k, v);
  }

  // В middleware важно прокинуть свежие куки внутрь текущего SSR запроса,
  // поэтому обновляем header Cookie у request, который пойдет дальше.
  map.set(name, encodeURIComponent(value));

  return Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

async function refreshTokens(refreshToken: string) {
  const refreshUrl = `${getApiUrl()}/api/refresh`;

  const resp = await fetch(refreshUrl, {
    method: "GET",
    headers: { refresh_token: refreshToken },
    cache: "no-store",
  });

  if (!resp.ok) return null;

  const data = await resp.json();

  const access = String(data["access_token"] ?? "");
  const refresh = String(data["refresh_token"] ?? "");
  if (!access || !refresh) return null;

  const accessExpires = toValidDate(
    typeof data["access_token_expires"] === "number"
      ? data["access_token_expires"] * 1000
      : data["access_token_expires"],
  );

  const refreshExpires = toValidDate(
    typeof data["refresh_token_expires"] === "number"
      ? data["refresh_token_expires"] * 1000
      : data["refresh_token_expires"],
  );

  return { access, refresh, accessExpires, refreshExpires };
}

/* =========================
   5) Единая функция "обеспечить авторизацию"
      mode = soft для course, mode = hard для protectedRoutes
   ========================= */

type EnsureMode = "soft" | "hard";

type EnsureResult = {
  headers: Headers;
  accessToken?: string;
  setCookies?: {
    access: string;
    refresh: string;
    accessExpires: Date;
    refreshExpires: Date;
  };
  deleteCookies?: boolean;
  failed?: boolean;
};

async function ensureAuth(
  request: NextRequest,
  mode: EnsureMode,
): Promise<EnsureResult> {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const nowSec = Math.floor(Date.now() / 1000);
  const skewSec = 30;

  const exp = accessToken ? readJwtExpSeconds(accessToken) : null;
  const needsRefresh = !accessToken || !exp || exp <= nowSec + skewSec;

  const requestHeaders = new Headers(request.headers);

  if (!needsRefresh) {
    return { headers: requestHeaders, accessToken };
  }

  // hard: без refresh_token доступ запрещен
  // soft: без refresh_token идем дальше как гость
  if (!refreshToken) {
    if (mode === "hard")
      return { headers: requestHeaders, failed: true, deleteCookies: true };
    return { headers: requestHeaders, deleteCookies: true };
  }

  const refreshed = await refreshTokens(refreshToken);
  if (!refreshed) {
    if (mode === "hard")
      return { headers: requestHeaders, failed: true, deleteCookies: true };
    return { headers: requestHeaders, deleteCookies: true };
  }

  // Критично: обновляем Cookie header у request, чтобы layout и server fetch
  // увидели новые токены в рамках текущего SSR запроса.
  const prevCookieHeader = requestHeaders.get("cookie") ?? "";
  let nextCookieHeader = prevCookieHeader;
  nextCookieHeader = upsertCookieHeader(
    nextCookieHeader,
    "access_token",
    refreshed.access,
  );
  nextCookieHeader = upsertCookieHeader(
    nextCookieHeader,
    "refresh_token",
    refreshed.refresh,
  );
  requestHeaders.set("cookie", nextCookieHeader);

  return {
    headers: requestHeaders,
    accessToken: refreshed.access,
    setCookies: refreshed,
  };
}

function applyAuthCookies(res: NextResponse, ensured: EnsureResult) {
  if (ensured.deleteCookies) {
    res.cookies.delete("access_token");
    res.cookies.delete("refresh_token");
    return;
  }

  if (!ensured.setCookies) return;

  const secure = process.env.NODE_ENV === "production";

  // Это уже Set-Cookie в HTTP-ответе браузеру.
  // Так refresh_token в браузере не останется старым после ротации на бэке.
  res.cookies.set("access_token", ensured.setCookies.access, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    expires: ensured.setCookies.accessExpires,
  });

  res.cookies.set("refresh_token", ensured.setCookies.refresh, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    expires: ensured.setCookies.refreshExpires,
  });
}

/* =========================
   6) middleware: старая логика и новая ветка разделены
   ========================= */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ранний выход для статики
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Новая ветка: любые /course пути
  // Тут "soft" режим: нет валидной сессии, пропускаем как гостя.
  if (COURSE_SEGMENT.test(pathname)) {
    const ensured = await ensureAuth(request, "soft");
    const res = NextResponse.next({ request: { headers: ensured.headers } });
    applyAuthCookies(res, ensured);
    return res;
  }

  // Старая ветка: protectedRoutes по твоей таблице
  const [route, spec] = removeSpec(pathname);

  if (isProtected(route)) {
    // Тут "hard" режим: нет валидной сессии, блокируем.
    const ensured = await ensureAuth(request, "hard");
    if (ensured.failed) {
      const res = NextResponse.rewrite(new URL("/401", request.url), {
        request: { headers: ensured.headers },
      });
      applyAuthCookies(res, ensured);
      return res;
    }

    const guard = protectedRoutesInfo[route];

    const accepted = await guard(
      spec,
      ensured.accessToken,
      pathname,
      request.nextUrl.searchParams,
    );

    let res: NextResponse;

    if (typeof accepted === "object") {
      res = NextResponse.rewrite(
        new URL(`/${accepted.errorCode}`, request.url),
        {
          request: { headers: ensured.headers },
        },
      );
    } else if (typeof accepted !== "boolean") {
      res = NextResponse.rewrite(new URL("/503", request.url), {
        request: { headers: ensured.headers },
      });
    } else if (!accepted) {
      res = NextResponse.rewrite(new URL("/403", request.url), {
        request: { headers: ensured.headers },
      });
    } else {
      res = NextResponse.next({ request: { headers: ensured.headers } });
    }

    applyAuthCookies(res, ensured);
    return res;
  }

  return NextResponse.next();
}
