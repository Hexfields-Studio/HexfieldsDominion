import type { SseListener } from "@/constants/customTypes";
import { useAuth } from "@/contexts/contexts";
import { useEffect } from "react";

export interface SseEventSourceProps {
  path: string;
  listeners: SseListener[];
}

export const useSseEventSource = (props: SseEventSourceProps) => {
  const { path, listeners } = props;

  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    let eventSource: EventSource;

    const connect = async () => {
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
      eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/${path}?sseToken=${sseToken}`);

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
      };

      listeners.forEach(listener => eventSource?.addEventListener(listener.type, listener.action));
    };

    connect();

    return () => {
      eventSource.close();
      listeners.forEach(listener => eventSource?.removeEventListener(listener.type, listener.action));
    };
  }, [fetchWithAuth, path, listeners]);
};