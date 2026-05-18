import { useParams } from "react-router";
import "@/index.css";
import GameField from "@/components/gameField/game_field";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { useEffect, useState } from "react";
import InMemoryMatchRepository from "@/repository/InMemoryMatchRepository";
import { useMatchRepository, useAuth } from "@/contexts/contexts";
import { useSseEventSource } from "@/hooks/useSseEventSource";
import { useHeartbeat } from "@/hooks/useHeartbeat";

const MatchPage = () => {
  const params = useParams();
  const matchUUID = params.uuid ?? "";
  const { setRepository } = useMatchRepository();
  const { fetchWithAuth } = useAuth();
  const [lobbyCode, setLobbyCode] = useState<string | undefined>();
  const eventSource = useSseEventSource(`games/${matchUUID}/events`);
  useHeartbeat(lobbyCode);

  eventSource?.addEventListener("matchUpdate", (event) => {
    console.log(`received matchUpdate: ${event.data}`);
  });

  useEffect(()=> {
    setRepository(new InMemoryMatchRepository);

    const fetchLobbyCode = async () => {
      const response = await fetchWithAuth(`/games/${matchUUID}/lobby`, "GET");
      if (!response || response.status !== 200) {
        return;
      }

      const responseJson = await response.json();

      setLobbyCode(responseJson.lobbyCode);
    };

    fetchLobbyCode();
  }, [setRepository, fetchWithAuth, matchUUID]);

  return (
    <>
      <OptionsButton/>
      <GameField boardRadius={3}/>
    </>
  );
};

export default MatchPage;