import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../contexts/contexts";

export const useMyRessources = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getMyRessources
  );
};