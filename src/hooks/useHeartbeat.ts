import { HEARTBEAT_INTERVAL } from "@/constants/constants";
import { useAuth } from "@/contexts/contexts";
import { useEffect } from "react";

export const useHeartbeat = (lobbyCode: string | undefined) => {
  const { fetchWithAuth } = useAuth();

  useEffect(() => {
    let heartbeatIntervalId: number;

    const scheduleHeartbeat = async () => {
      heartbeatIntervalId = setInterval(() => {
        const playerIdRaw = localStorage.getItem("playerId");
        if (!playerIdRaw || !lobbyCode) {
          return;
        }

        fetchWithAuth(`/lobbies/${lobbyCode}/heartbeat`, "POST", JSON.stringify({
          "playerId": Number.parseInt(playerIdRaw),
        }));
      }, HEARTBEAT_INTERVAL);
    };

    scheduleHeartbeat();

    return () => {
      clearInterval(heartbeatIntervalId);
    };
  }, [fetchWithAuth, lobbyCode]);
};