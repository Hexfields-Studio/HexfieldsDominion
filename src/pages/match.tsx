import { useParams } from "react-router";
import "@/index.css";
import styles from "@/pages/match.module.scss";
import GameField from "@/components/gameField/game_field";
import OptionsButton from "@/components/optionsButton/optionsButton";
import { useEffect, useState } from "react";
import InMemoryMatchRepository from "@/repository/InMemoryMatchRepository";
import { useMatchRepository, useAuth } from "@/contexts/contexts";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { GameProvider } from "@/contexts/GameContext";
import type { Field } from "@/repository/MatchRepository";

const MatchPage = () => {
  const params = useParams();
  const matchUUID = params.uuid ?? "";
  const { repository, setRepository } = useMatchRepository();
  const { fetchWithAuth } = useAuth();
  const [lobbyCode, setLobbyCode] = useState<string | undefined>();
  useHeartbeat(lobbyCode);

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
  }, []);

  useEffect(()=>{
    const fetchFields = async () => {
      const res = await fetchWithAuth(`/games/${matchUUID}/fields`, "GET");
      if (!res || res.status !== 200) {
        return;
      }

      const resJson: Field[] = await res.json();
      repository.setFields(resJson);
    }
    fetchFields();
  }, [repository])

  return (
    <div className={styles.matchPageContainer}>
      <OptionsButton/>
      <GameProvider gameUUID={matchUUID}>
        <GameField boardRadius={3}/>
      </GameProvider>
    </div>
  );
};

export default MatchPage;