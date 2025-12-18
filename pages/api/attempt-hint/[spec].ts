// pages/api/stream.ts - SIMPLER VERSION
import { NextRequest } from "next/server";
import { getCookieValue } from "@utils/cookies";
import { getApiUrl } from "@utils/getServerUrl";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  const spec = req.nextUrl.searchParams.get("spec");
  const access_token = getCookieValue(req.cookies.toString(), "access_token");

  try {
    const backendResponse = await fetch(
      `${getApiUrl()}/api/attempt-hint/${spec}`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: req.cookies.toString(),
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (backendResponse.status == 429) {
      return new Response((await backendResponse.json()).error, {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!backendResponse.ok) {
      return new Response(JSON.stringify({ error: "Backend failed" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!backendResponse.body) {
      return new Response(JSON.stringify({ error: "Empty response body" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simply pass through the stream without transformation
    return new Response(backendResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
