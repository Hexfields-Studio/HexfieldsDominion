import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const usePlayerTrades = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getPlayerTrades,
  );
};