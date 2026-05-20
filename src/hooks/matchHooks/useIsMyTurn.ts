import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useIsMyTurn = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.isItMyTurn,
  );
};