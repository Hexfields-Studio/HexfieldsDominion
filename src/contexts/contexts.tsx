import { createContext, useContext } from "react";
import type { AuthContextType } from "./AuthContext";
import type { MatchRepositoryContextType } from "./MatchRepositoryContext";
import type { ThemeContextType } from "./ThemeContext";

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