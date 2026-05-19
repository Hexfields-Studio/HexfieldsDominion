import { type ReactNode } from "react";
import { SseContext } from "./contexts";
import { useSseEventSource } from "@/hooks/useSseEventSource";

export interface SseContextType {
  eventSource: EventSource | undefined;
}

export interface SseContextProps {
  path: string;
  children: ReactNode;
}

export const SseProvider = (props: SseContextProps) => {
  const { path, children } = props;

  const eventSource = useSseEventSource(path);
  
  return (
    <SseContext.Provider value={{ eventSource }}>
      {children}
    </SseContext.Provider>
  );
};