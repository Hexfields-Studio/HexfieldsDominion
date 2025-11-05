import { createContext, useContext, useState, type ReactNode } from "react";

interface TestContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const ContextProviderTEST = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <TestContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within GameProvider");
  return context;
};
