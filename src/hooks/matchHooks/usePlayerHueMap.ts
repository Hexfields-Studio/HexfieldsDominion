import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const usePlayerHueMap = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getPlayerHueMap,
  );
};