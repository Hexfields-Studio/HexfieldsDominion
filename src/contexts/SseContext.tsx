import { useEffect, useRef, useState, type ReactNode } from "react";
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

  const [listeners, setListeners] = useState<SseListener[]>([]);
  const listenersRef = useRef<SseListener[]>([]);

  const registerListeners = (listenersToAdd: SseListener[]) => {
    listenersToAdd.forEach(listener => listenersRef.current.push(listener));
    setListeners(listenersRef.current);
  };

  const eventSourceProps: SseEventSourceProps = {
    path,
    listeners: listeners,
  };
  const { connectSse } = useSseEventSource(eventSourceProps);

  useEffect(() => {
    // we can't use listenersRef in eventSourceProps directly, so wait until listeners are present before connecting
    if (listeners != listenersRef.current) {
      return;
    }
    connectSse();
  }, [connectSse, listeners]);
  
  return (
    <SseContext.Provider value={{ registerListeners }}>
      {children}
    </SseContext.Provider>
  );
};