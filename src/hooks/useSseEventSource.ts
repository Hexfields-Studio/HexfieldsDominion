import { useAuth } from "@/contexts/contexts";
import { useEffect, useState } from "react";

export const useSseEventSource = (path: string) => {
  const [eventSource, setEventSource] = useState<undefined | EventSource>();
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
      setEventSource(eventSource);

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
      };
    };

    connect();

    return () => {
      eventSource.close();
    };
  }, [fetchWithAuth, path, setEventSource]);

  return eventSource;
};