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
      if (!active) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const baseUrl = `${protocol}//${window.location.host}`;
      const params = new URLSearchParams({
        entity,
        spec,
        host,
        moderator: String(moderator),
      });

      ws = new WebSocket(`${baseUrl}/api/ws/chat?${params}`);

      ws.onopen = () => {
        const token = getCookie("access_token") ?? "";
        ws?.send(token);
      };

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
        // 4001 = bad/expired token; 4003 = auth timeout — wait for cookie refresh
        const delay =
          event.code === 4001 || event.code === 4003 ? 30_000 : 3_000;
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
