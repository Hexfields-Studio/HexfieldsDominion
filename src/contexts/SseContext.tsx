import { useRef, type ReactNode } from "react";
import { SseContext } from "./contexts";
import { useSseEventSource, type SseEventSourceProps } from "@/hooks/sseHooks/useSseEventSource";
import type { SseListener } from "@/constants/customTypes";

export interface SseContextType {
  registerListeners: (listeners: SseListener[]) => void;
}

export interface SseContextProps {
  path: string;
  children: ReactNode;
}

export const SseProvider = (props: SseContextProps) => {
  const { path, children } = props;

  const listenersRef = useRef<SseListener[]>([]);

  const registerListeners = (listeners: SseListener[]) => {
    listeners.forEach(listener => listenersRef.current.push(listener));
  };

  const eventSourceProps: SseEventSourceProps = {
    path,
    listeners: listenersRef.current,
  };
  useSseEventSource(eventSourceProps);
  
  return (
    <SseContext.Provider value={{ registerListeners }}>
      {children}
    </SseContext.Provider>
  );
};