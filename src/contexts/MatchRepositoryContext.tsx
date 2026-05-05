import { useState, type ReactNode } from "react";
import InMemoryMatchRepository from "@/repository/InMemoryMatchRepository";
import { MatchRepositoryContext } from "./contexts";

export interface MatchRepositoryContextType {
  repository: InMemoryMatchRepository;
  setRepository: (value: InMemoryMatchRepository) => void;
}

export const RepositoryContextProvider = ({ children }: { children: ReactNode }) => {
  const [repository, setRepository] = useState(new InMemoryMatchRepository);

  return (
    <MatchRepositoryContext.Provider value={{ repository: repository, setRepository: setRepository }}>
      {children}
    </MatchRepositoryContext.Provider>
  );
};