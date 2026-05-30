import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useCurrentDiceResult = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getCurrentDiceResult,
  );
};