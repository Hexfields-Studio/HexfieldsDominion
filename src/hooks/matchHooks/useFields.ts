import { useSyncExternalStore } from "react";
import { useMatchRepository } from "../../contexts/contexts";

export const useFields = () => {
  const { repository } = useMatchRepository();

  return useSyncExternalStore(
    repository.subscribe,
    repository.getFields,
  );
};