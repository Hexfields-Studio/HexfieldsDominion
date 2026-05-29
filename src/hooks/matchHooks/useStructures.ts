import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useStructures = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getStructures,
  );
};