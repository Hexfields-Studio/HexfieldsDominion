import { type ReactNode } from "react";
import { FetchWithTimeoutContext } from "./contexts";
import { FETCH_TIMEOUT } from "@/constants/constants";
import { useError } from "@/hooks/useError";

export type FetchWithTimeoutContextType = {
    fetchWithTimeout: (input: RequestInfo | URL, init: RequestInit) => Promise<Response>;
}

export const FetchWithTimeoutProvider = ({ children }: {children: ReactNode}) => {
  const { errorDialog, openErrorDialog } = useError();

  const onTimeout = () => {
    openErrorDialog("Unfortunately, the server is currently unavailable.");
  };

  const fetchWithTimeout = async (input: RequestInfo | URL, init: RequestInit) => {
    const timer = setTimeout(() => {
      onTimeout();
    }, FETCH_TIMEOUT);

    const response = await fetch(input, init);
    clearTimeout(timer);
    return response; 
  };

  return (
    <FetchWithTimeoutContext.Provider value={{ fetchWithTimeout }}>
      {errorDialog}
      {children}
    </FetchWithTimeoutContext.Provider>
  );
};