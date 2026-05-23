import { createContext, useContext } from "react";
import type { AuthContextType } from "./AuthContext";
import type { MatchRepositoryContextType } from "./MatchRepositoryContext";
import type { ThemeContextType } from "./ThemeContext";
import type { SseContextType } from "./SseContext";
import type { GameContextType } from "./GameContext";
import type { FetchWithTimeoutContextType } from "./FetchWithTimeoutContext";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
    
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
    
  return context;
};


export const MatchRepositoryContext = createContext<MatchRepositoryContextType | undefined>(undefined);

export const useMatchRepository = () => {
  const context = useContext(MatchRepositoryContext);
  if (!context) throw new Error("Check if useRepository is called inside a RepositoryContextProvider");
  return context;
};


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};


export const SseContext = createContext<SseContextType | undefined>(undefined);

export const useSseContext = () => {
  const context = useContext(SseContext);
  if (!context) throw new Error("useSseContext must be used within SseContextProvider");
  return context;
};


export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameContextProvider");
  return context;
};


export const FetchWithTimeoutContext = createContext<FetchWithTimeoutContextType | undefined>(undefined);

export const useFetchWithTimeout = () => {
  const context = useContext(FetchWithTimeoutContext);
  if (!context) throw new Error("useFetchWithTimeout must be used within FetchWithTimeoutContextProvider");
  return context;
};