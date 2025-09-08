// pages/api/stream.ts
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
      },
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

    // Create a transform stream to handle chunks
    const transformer = new TransformStream({
      async transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    // Pipe the stream through our transformer
    const transformedStream = backendResponse.body.pipeThrough(transformer);

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
