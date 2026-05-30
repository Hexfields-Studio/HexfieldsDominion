import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useWinner = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getWinner,
  );
};