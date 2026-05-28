"use client";
import { IChatMessage } from "@custom-types/data/IMessage";
import { IActivity } from "@custom-types/data/atomic";
import { getCookie } from "@utils/cookies";
import { useEffect, useRef } from "react";

export function useWebSocketChat({
  entity,
  spec,
  host,
  moderator,
  onMessage,
}: {
  entity: IActivity;
  spec: string;
  host: string;
  moderator: boolean;
  onMessage: (message: IChatMessage) => void;
}) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    let active = true;
    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      const token = getCookie("access_token");
      if (!token || !active) return;

      const baseUrl =
        process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8000";
      const params = new URLSearchParams({
        token,
        entity,
        spec,
        host,
        moderator: String(moderator),
      });

      ws = new WebSocket(`${baseUrl}/api/ws/chat?${params}`);

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as IChatMessage;
          onMessageRef.current(message);
        } catch (_) {
          // ignore malformed JSON frames
        }
      };

      ws.onclose = (event) => {
        if (!active) return;
        // 4001 = auth rejected (bad/expired token) — wait for HTTP to refresh cookie
        const delay = event.code === 4001 ? 30_000 : 3_000;
        reconnectTimeout = setTimeout(connect, delay);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [entity, spec, host, moderator]);
}
