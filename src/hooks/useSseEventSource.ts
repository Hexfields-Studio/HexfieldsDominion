import { HEARTBEAT_INTERVAL } from "@/constants/constants";
import { useAuth, useMatchRepository } from "@/contexts/contexts";
import { useEffect, useState } from "react";

export const useSseEventSource = (path: string, lobbyCode: string) => {
  const [eventSource, setEventSource] = useState<undefined | EventSource>();
  const { fetchWithAuth } = useAuth();
  const { repository } = useMatchRepository();

  useEffect(() => {
    let eventSource: EventSource;
    let heartbeatIntervalId: number;

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

    connect().then(() => {
      scheduleHeartbeat();
    });

    const scheduleHeartbeat = () => {
      heartbeatIntervalId = setInterval(() => {
        const playerIdRaw = localStorage.getItem("playerId");
        if (!playerIdRaw) {
          return;
        }

        fetchWithAuth(`/lobbies/${lobbyCode}/heartbeat`, "POST", JSON.stringify({
          "playerId": Number.parseInt(playerIdRaw),
        }));
      }, HEARTBEAT_INTERVAL);
    };

    return () => {
      eventSource.close();
      clearInterval(heartbeatIntervalId);
    };
  }, [fetchWithAuth, path, lobbyCode, repository]);

  return eventSource;
};