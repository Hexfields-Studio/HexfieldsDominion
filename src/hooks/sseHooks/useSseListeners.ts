import type { SseListener } from "@/constants/customTypes";
import { SseContext } from "@/contexts/contexts";
import { useContext, useEffect } from "react";

export function useSseListeners(listeners: SseListener[]) {
  const context = useContext(SseContext);
  if (!context) {
    throw new Error("useSseListener must be used within a SseProvider");
  }

  const { registerListeners } = context;

  useEffect(() => {
    registerListeners(listeners);
  }, [listeners, registerListeners]);
}