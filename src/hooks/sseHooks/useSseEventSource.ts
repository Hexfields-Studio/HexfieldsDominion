import type { SseListener } from "@/constants/customTypes";
import { useAuth } from "@/contexts/contexts";
import { useRef } from "react";

export type useSseEventSourceType = {
  connectSse: () => Promise<void>;
}

export interface SseEventSourceProps {
  path: string;
  listeners: SseListener[];
}

export const useSseEventSource: ((props: SseEventSourceProps) => useSseEventSourceType) = (props: SseEventSourceProps) => {
  const { path, listeners } = props;

  const { fetchWithAuth } = useAuth();
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = async () => {
    if (eventSourceRef.current) {
      return;
    }
    const sseToken = await fetchSseToken();
    if (!sseToken) {
      return;
    }

    setupEventSource(sseToken);
  };

  const fetchSseToken: (() => Promise<string | undefined>) = async () => {
    const response = await fetchWithAuth("/auth/ssetoken", "GET");
    if (!response) {
      return;
    }
    const sseToken = await response.text();
    return sseToken;
  };

  const setupEventSource = (sseToken: string) => {
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/${path}?sseToken=${sseToken}`);
    eventSourceRef.current = eventSource;

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
    };

    listeners.forEach(listener => eventSource?.addEventListener(listener.type, listener.action));
  };

  return { connectSse: connect };
};