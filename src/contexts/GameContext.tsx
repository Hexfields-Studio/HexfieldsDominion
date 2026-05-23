import { useEffect, useState, type ReactNode } from "react";
import { GameContext } from "./contexts";
import { SseProvider } from "./SseContext";

export type GameContextType = {
    uuid: string | undefined;
}

export interface GameContextProps {
  gameUUID: string;
  children: ReactNode;
}

export const GameProvider = (props: GameContextProps) => {
  const { gameUUID, children } = props;

  const [uuid, setUUID] = useState<string | undefined>();

  useEffect(() => {
    const updateUUID = async () => {
      setUUID(gameUUID);
    };
    updateUUID();
  }, [gameUUID]);

  return (
    <GameContext.Provider value={{ uuid }}>
      <SseProvider path={`games/${gameUUID}/events`}>
        {children}
      </SseProvider>
    </GameContext.Provider>
  );
};