import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { GameContext } from "./contexts";
import { SseProvider } from "./SseContext";
import type { PlayerResources } from "@/repository/MatchRepository";

type ShowGrantedResourcesAction = (grantedResources: PlayerResources) => void;

export type GameContextType = {
  uuid: string | undefined;
  showGrantedResources: (grantedResources: PlayerResources) => void;
  showGrantedResourcesActionRef: RefObject<ShowGrantedResourcesAction | undefined>;
}

export interface GameContextProps {
  gameUUID: string;
  children: ReactNode;
}

export const GameProvider = (props: GameContextProps) => {
  const { gameUUID, children } = props;

  const showGrantedResourcesActionRef = useRef<ShowGrantedResourcesAction>(undefined);
  const [uuid, setUUID] = useState<string | undefined>();

  useEffect(() => {
    const updateUUID = async () => {
      setUUID(gameUUID);
    };
    updateUUID();
  }, [gameUUID]);

  const showGrantedResources = (grantedResources: PlayerResources) => {
    if (!showGrantedResourcesActionRef.current) {
      return;
    }
    showGrantedResourcesActionRef.current(grantedResources);
  };

  return (
    <GameContext.Provider value={{ uuid, showGrantedResources, showGrantedResourcesActionRef }}>
      <SseProvider path={`games/${gameUUID}/events`}>
        {children}
      </SseProvider>
    </GameContext.Provider>
  );
};