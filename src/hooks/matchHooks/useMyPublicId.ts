import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useMyPublicId = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getMyPublicId,
  );
};