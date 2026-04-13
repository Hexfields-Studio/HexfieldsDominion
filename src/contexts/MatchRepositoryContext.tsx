import { createContext, useContext, useState, type ReactNode } from "react";
import InMemoryMatchRepository from "../repository/InMemoryMatchRepository";

interface MatchRepositoryContextType {
  repository: InMemoryMatchRepository;
  setRepository: (value: InMemoryMatchRepository) => void;
}

const MatchRepositoryContext = createContext<MatchRepositoryContextType | undefined>(undefined);

export const RepositoryContextProvider = ({ children }: { children: ReactNode }) => {
  const [repository, setRepository] = useState(new InMemoryMatchRepository);

  return (
    <MatchRepositoryContext.Provider value={{ repository: repository, setRepository: setRepository }}>
      {children}
    </MatchRepositoryContext.Provider>
  );
};

export const useMatchRepository = () => {
  const context = useContext(MatchRepositoryContext);
  if (!context) throw new Error("Check if useRepository is called inside a RepositoryContextProvider");
  return context;
};