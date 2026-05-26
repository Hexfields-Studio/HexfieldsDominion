import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useMyPoints = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getMyPoints,
  );
};