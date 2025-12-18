import { useCallback, useState } from "react";

interface IStreamData {
  loading: boolean;
  streaming: boolean;
  data: string;
  chunk: string;
  error: string | null;
  startStream: () => Promise<void>;
}

export function useStream(
  url: string,
  method?: "GET" | "POST",
  body?: any
): IStreamData {
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [content, setContent] = useState("");
  const [chunk, setChunk] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startStream = useCallback(async () => {
    setLoading(true);
    setStreaming(false);
    setContent("");
    setChunk("");
    setError(null);

    try {
      const init: any = {
        headers: {
          Accept: "text/event-stream",
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      };
      if (method != "GET") {
        init.method = method || "POST";
      }
      if (body != undefined) {
        init.body = JSON.stringify(body);
      }
      const response = await fetch(`/api/${url}`, init);

      if (!response.ok) {
        setLoading(false);
        setError(await response.text());
        return;
      }

      if (!response.body) {
        throw new Error("No readable stream in response");
      }

      setLoading(false);
      setStreaming(true);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // find all "data:" occurrences
        const parts = buffer.split(/(?=data:)/g);

        // keep last partial (may be incomplete JSON)
        buffer = parts.pop() || "";

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith("data:")) continue;

          const jsonStr = line.slice(5).trim();
          try {
            const data = JSON.parse(jsonStr);

            if (data.content) {
              setContent((prev) => prev + data.content);
              setChunk(data.content);
            } else if (data.event === "complete") {
              setStreaming(false);
            } else if (data.event === "error") {
              setError(data.message ?? "Unknown server error");
              setStreaming(false);
            }
          } catch {
            // ignore incomplete fragments, leave in buffer
            buffer = part;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unknown error");
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  }, [url, method, body]);

  return {
    loading,
    streaming,
    data: content,
    chunk,
    error,
    startStream,
  };
}
